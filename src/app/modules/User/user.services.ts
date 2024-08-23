import { tuple } from "zod";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { IUser, IUserFilterRequest } from "./user.interface";
import * as bcrypt from "bcrypt";
import { IPaginationOptions } from "../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma, UserRole } from "@prisma/client";
import { userSearchAbleFields } from "./user.costant";

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
const getUsersFromDb = async (
  params: IUserFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  //console.log(filterData);
  if (params.searchTerm) {
    andCondions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditons: Prisma.UserWhereInput = { AND: andCondions };

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
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
  const total = await prisma.user.count({
    where: whereConditons,
  });

  if (!result || result.length === 0) {
    throw new ApiError(404, "No active users found");
  }
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// update profile
const updateProfile = async (user: IUser, payload: IUser) => {
  console.log(user);

  console.log(payload);
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
      lastName: payload.lastName,
      username: payload.username,
      email: payload.email,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      role: true,
      userStatus: true,
    },
  });

  return updatedUser;
};

const updateUserIntoDb = async (payload: IUser, id: string) => {
  console.log(payload, id, "from user upate role and status");

  // Retrieve the existing user info
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  // Update the user with the provided payload
  const result = await prisma.user.update({
    where: {
      id: userInfo.id,
    },
    data: {
      userStatus: payload.userStatus || userInfo.userStatus,
      role: payload.role || userInfo.role,
      updatedAt: new Date(),
    },
  });

  return result;
};

export const userService = {
  createUserIntoDb,
  getUsersFromDb,
  createAdminIntoDb,
  updateProfile,
  updateUserIntoDb,
};
