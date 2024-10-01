import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

// create user card details
const createUserCardIntoDb = async (payload: any) => {
  if (!payload.userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User ID must be provided.");
  }
  const isUserExist = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Not found.");
  }

  const result = await prisma.userCardDetails.create({
    data: payload,
  });
  if (!result) {
    throw new ApiError(httpStatus.OK, "Failed to create user card details");
  }
  return result;
};

// get all card details
const getUserCardDetails = async () => {
  const result = await prisma.userCardDetails.findMany({});
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "No user card details found.");
  }
  return result;
};

// get card  details by user id

const getUserCardDetailsByUserId = async (userId: string) => {
  const result = await prisma.userCardDetails.findMany({
    where: {
      userId,
    },
  });
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "No user card details found for this user."
    );
  }
  return result;
};
export const UserCardSErvice = {
  createUserCardIntoDb,
  getUserCardDetails,
  getUserCardDetailsByUserId
};
