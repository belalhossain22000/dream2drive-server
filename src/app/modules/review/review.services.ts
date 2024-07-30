import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { Review } from "./review.interface";

const createReviewIntoDb = async (payload: Review) => {
  await prisma.user.findFirstOrThrow({
    where: {
      id: payload.userId,
    },
  });

  await prisma.products.findFirstOrThrow({
    where: {
      id: payload.productId,
    },
  });

  // Create the review in the database
  const result = await prisma.review.create({
    data: {
      userId: payload.userId,
      productId: payload.productId,
      comment: payload.comment,
    },
  });

  return result;
};

const getReviewsWithUser = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      user: true, // Include the related user data
      product: true, // Include the related product data (if needed)
    },
  });

  if (!reviews) {
    throw new ApiError(404, `Review not found`);
  }

  return reviews;
};

export const reviewService = {
  createReviewIntoDb,
  getReviewsWithUser,
};
