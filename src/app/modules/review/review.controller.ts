import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { reviewService } from "./review.services";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.createReviewIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Review created successfully",
    data: result,
  });
});

const getReview = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.getReviewsWithUser();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Review created successfully",
    data: result,
  });
});
const getSingleReview = catchAsync(async (req: Request, res: Response) => {
  const id = req?.params?.id;
  const result = await reviewService.getSingleProductReviewsWithUser(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single Review Retrived successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
  getReview,
  getSingleReview,
};
