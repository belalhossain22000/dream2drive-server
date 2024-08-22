import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { wishlistService } from "./wishlist.service";

// create wishlist
const createWishlist = catchAsync(async (req: Request, res: Response) => {
  const result = await wishlistService.createWishlistIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "wishlist Created successfully!",
    data: result,
  });
});

// create wishlist
const getWishlistByUser = catchAsync(async (req: Request, res: Response) => {
  const id=req.params.id;
  const result = await wishlistService.getWishlistByUserFromDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "wishlist reterive successfully!",
    data: result,
  });
});
// const getWishlistBySingleUser = catchAsync(
//   async (req: Request, res: Response) => {
//     const id = req.params.id;
//     const result = await wishlistService.getWishByUserFromDB(id);
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "User wishlist reterive successfully!",
//       data: result,
//     });
//   }
// );
const deleteWishlist = catchAsync(async (req: Request, res: Response) => {
  const { userId, productId } = req.body;
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
  createWishlist,
  getWishlistByUser,
  deleteWishlist,
};
