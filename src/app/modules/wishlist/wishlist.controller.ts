import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { wishlistService } from "./wishlist.service";

// create wishlist
const toggleWishlist = catchAsync(async (req: Request, res: Response) => {
  const id = req?.user?.id;
  console.log(id, req.body);
  const result = await wishlistService.toggleWishlistInDb(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message || "wishlist Created successfully!",
    data: result.result,
  });
});

// create wishlist
const getWishlistByUser = catchAsync(async (req: Request, res: Response) => {
  const id = req?.user?.id;
  const result = await wishlistService.getWishlistByUserFromDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "wishlist reterive successfully!",
    data: result,
  });
});

const deleteWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?.id;
  const { productId } = req.body;
  const result = await wishlistService.deleteWishlistFromDb({
    userId,
    productId,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wishlist item deleted successfully!",
    data: result,
  });
});
export const wishlistController = {
  toggleWishlist,
  getWishlistByUser,
  deleteWishlist,
};
