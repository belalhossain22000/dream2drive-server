import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { Wishlist } from "./wishlist.interface";

// create wishlist
const createWishlistIntoDb = async (payload: Wishlist) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { id: payload.userId },
  });

  const product = await prisma.product.findFirstOrThrow({
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
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product is already in the user's wishlist."
    );
  }

  const wishlistItem = await prisma.wishlist.create({
    data: {
      userId: user.id,
      productId: product.id,
    },
  });

  return wishlistItem;
};

const getWishlistByUserFromDb = async (id: any) => {
  if (!id) {
    throw new ApiError(400, "User ID must be provided.");
  }

  //   // Check if the user exists
  const user = await prisma.user.findFirstOrThrow({
    where: { id: id },
  });

  const result = await prisma.wishlist.findMany({
    where: { userId: id },
    include: {
      user: true,
      product: true,
    },
  });
  console.log(result, "from service wishlist ================================");

  return result;
};
// const getWishByUserFromDB = async (userId: string) => {
//   // Check if the product exists
//   const product = await prisma.product.findFirst({
//     where: { userId: userId },
//   });

//   if (!product) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Product not found.");
//   }

//   // Fetch the wishlist items for the user
//   const result = await prisma.wishlist.findMany({
//     where: {
//       userId: userId,
//     },
//   });

//   return result;
// };
const deleteWishlistFromDb = async (payload: {
  userId: string;
  productId: string;
}) => {
  if (!payload.userId || !payload.productId) {
    throw new ApiError(400, "User ID and Product ID must be provided.");
  }

  // Check if the user exists
  await prisma.user.findFirstOrThrow({
    where: { id: payload.userId },
  });

  // Check if the product exists
  await prisma.product.findFirstOrThrow({
    where: { id: payload.productId },
  });

  // Check if the wishlist item exists
  const existingWishlistItem = await prisma.wishlist.findFirst({
    where: {
      userId: payload.userId,
      productId: payload.productId,
    },
  });

  if (!existingWishlistItem) {
    throw new ApiError(404, "Wishlist item not found.");
  }

  // Delete the wishlist item
  await prisma.wishlist.delete({
    where: {
      id: existingWishlistItem.id,
    },
  });

  return { message: "Wishlist item successfully deleted." };
};
export const wishlistService = {
  createWishlistIntoDb,
  getWishlistByUserFromDb,
  deleteWishlistFromDb,
};
