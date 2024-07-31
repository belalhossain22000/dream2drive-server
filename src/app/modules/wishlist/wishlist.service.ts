import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { Wishlist } from "./wishlist.interface";

// create wishlist
const createWishlistIntoDb = async (payload: Wishlist) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { id: payload.userId },
  });

  const product = await prisma.products.findFirstOrThrow({
    where: { id: payload.productId },
  });

  // Check if the product is already in the user's wishlist
  const existingWishlistItem = await prisma.wishlist.findFirst({
    where: {
      userId: user.id,
      productId: product.id,
    },
  });

  if (existingWishlistItem) {
    throw new Error("Product is already in the user's wishlist.");
  }

  const wishlistItem = await prisma.wishlist.create({
    data: {
      userId: user.id,
      productId: product.id,
    },
  });

  return wishlistItem;
};

const getWishlistByUserFromDb = async (payload: { userId: string }) => {

  if (!payload.userId) {
    throw new ApiError(400, "User ID must be provided.");
  }
  //   // Check if the user exists
  const user = await prisma.user.findFirstOrThrow({
    where: { id: payload.userId },
  });


  const result = await prisma.wishlist.findMany({
    where: { userId: payload.userId },
    include: {
      user: true,
      product: true,
    },
  });

  return result;
};

export const wishlistService = {
  createWishlistIntoDb,
  getWishlistByUserFromDb,
};
