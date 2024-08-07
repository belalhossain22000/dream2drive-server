import { tuple } from "zod";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { IUser } from "./user.interface";
import * as bcrypt from "bcrypt";

// Create a new user in the database.
const createUserIntoDb = async (payload: IUser) => {
  console.log(payload);
  // Check if user with the same email or username already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: payload.email }, { username: payload.username }],
    },
  });

  if (existingUser) {
    throw new ApiError(400, "User with this email or username already exists");
  }

  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  const result = await prisma.user.create({
    data: {
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      username: payload.username,
      password: hashedPassword,
      role: "USER",
      userStatus: "ACTIVE",
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
    },
  });

  const { password, ...userWithoutPassword } = result;

  return userWithoutPassword;
};

// / Create a new user in the database.
const createAdminIntoDb = async (payload: IUser) => {
  // Check if user with the same email or username already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: payload.email }, { username: payload.username }],
    },
  });

  if (existingUser) {
    throw new ApiError(400, "User with this email or username already exists");
  }

  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  const result = await prisma.user.create({
    data: {
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      username: payload.username,
      password: hashedPassword,
      role: "ADMIN",
      userStatus: "ACTIVE",
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
    },
  });

  const { password, ...userWithoutPassword } = result;

  return userWithoutPassword;
};

// reterive all users from the database
const getUsersFromDb = async () => {
  const result = await prisma.user.findMany({
    where: {
      userStatus: "ACTIVE",
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      username: true,
      role: true,
      userStatus: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!result || result.length === 0) {
    throw new ApiError(404, "No active users found");
  }
  return result;
};

// update profile
const updateProfile = async (user: IUser, payload: IUser) => {
  console.log(payload)
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      id: payload.id,
    },
  });

  // Update the user profile with the new information
  const updatedUser = await prisma.user.update({
    where: {
      email: userInfo.email,
    },
    data: {
      firstName: payload.firstName,
      lastName:payload.lastName,
      username:payload.username,
      email:payload.email

    },
    select:{
      id:true,
      firstName:true,
      lastName:true,
      username:true,
      email:true,
      role:true,
      userStatus:true
    }
  });

  return updatedUser;
};

export const userService = {
  createUserIntoDb,
  getUsersFromDb,
  createAdminIntoDb,
  updateProfile,
};
