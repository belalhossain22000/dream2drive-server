import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { Wishlist } from "./wishlist.interface";

// create wishlist
const toggleWishlistInDb = async (userId: string, payload: Wishlist) => {
 
  if (!userId || !payload.productId) {
    throw new ApiError(400, "User ID and Product ID must be provided.");
  }

  const user = await prisma.user.findFirstOrThrow({
    where: { id: userId },
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
    // If the product is already in the wishlist, remove it
    const result = await prisma.wishlist.delete({
      where: {
        id: existingWishlistItem.id,
      },
    });
    return { message: "Product removed from wishlist.", result };
  } else {
    // If the product is not in the wishlist, add it
    const result = await prisma.wishlist.create({
      data: {
        userId: user.id,
        productId: product.id,
      },
    });
    return { message: "Product add into  wishlist.", result };
  }
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
 

  return result;
};

// delete from wishlist
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
  const result = await prisma.wishlist.delete({
    where: {
      id: existingWishlistItem.id,
    },
  });

  return result;
};
export const wishlistService = {
  toggleWishlistInDb,
  getWishlistByUserFromDb,
  deleteWishlistFromDb,
};
