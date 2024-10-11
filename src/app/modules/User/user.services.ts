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
      mobile: payload.mobile,
      password: hashedPassword,
      crediteCardStatus: payload.crediteCardStatus,
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
      mobile: payload.mobile,
      crediteCardStatus: payload.crediteCardStatus,
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

  // Count how many cars each user has bought from the `paymentInfo` table
  const carsBoughtCount = await prisma.paymentInfo.groupBy({
    by: ["clientId"],
    _count: {
      carsId: true,
    },
  });

  // Count how many cars each user has in their wishlist from the `wishlist` table
  const wishlistCount = await prisma.wishlist.groupBy({
    by: ["userId"],
    _count: {
      productId: true,
    },
  });

  // Count how many vehicles each user has sourced from the `vehicleSourcing` table
  const vehicleCountByUser = await prisma.vehicleInfo.groupBy({
    by: ["email"],
    _count: {
      id: true,
    },
  });

  const andCondions: Prisma.UserWhereInput[] = [];

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

  const users = await prisma.user.findMany({
    where: whereConditons,

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
      crediteCardStatus: true,
      mobile: true,
      role: true,
      userStatus: true,
      createdAt: true,
      updatedAt: true,
      userCardDetails: true,
      Payment: true,
    },
  });
  const total = await prisma.user.count({
    where: whereConditons,
  });

  const result = users.map((user) => {
    const vehicleCount =
      vehicleCountByUser.find((vehicle) => vehicle.email === user.email)?._count
        .id || 0;
    const boughtCars =
      carsBoughtCount.find((buy) => buy.clientId === user.id)?._count.carsId ||
      0;
    const wishlistCars =
      wishlistCount.find((wishlist) => wishlist.userId === user.id)?._count
        .productId || 0;
    return {
      ...user,
      vehicleCount,
      wishlistCars,
      boughtCars,
    };
  });

  if (!result) {
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

const getUserByEmailFromDb = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};
const getAdminFromDB = async () => {
  const user = await prisma.user.findMany({
    where: {
      role: "ADMIN",
    },
    select: {
      id: true,
      email: true,
    },
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};
const getUserByIdFromDb = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      username: true,
      mobile: true,
      crediteCardStatus: true,
      role: true,
      userStatus: true,
      createdAt: true,
      updatedAt: true,
      userCardDetails: true,
      Payment: true,
    },
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};
// update profile
const updateProfile = async (user: IUser, payload: IUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      id: user.id,
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
      // crediteCardStatus: payload.crediteCardStatus,
      mobile: payload.mobile,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      crediteCardStatus: true,
      mobile: true,
      email: true,
      role: true,
      userStatus: true,
    },
  });

  return updatedUser;
};

const updateUserIntoDb = async (payload: IUser, id: string) => {
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
      email: payload.email || userInfo.email,
      firstName: payload.firstName || userInfo.firstName,
      lastName: payload.lastName || userInfo.lastName,
      username: payload.username || userInfo.username,
      crediteCardStatus:
        payload.crediteCardStatus || userInfo.crediteCardStatus,
      mobile: payload.mobile || userInfo.mobile,
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
  getUserByIdFromDb,
  getUserByEmailFromDb,
  getAdminFromDB
};
