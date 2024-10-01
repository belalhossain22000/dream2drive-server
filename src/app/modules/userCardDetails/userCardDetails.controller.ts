import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { UserCardSErvice } from "./userCardDetails.service";

const createUserCardDetails = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserCardSErvice.createUserCardIntoDb(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User card details created successfully",
      data: result,
    });
  }
);
const getUserCardDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await UserCardSErvice.getUserCardDetails();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User card details reterive successfully",
    data: result,
  });
});

const getUserCardDetailsByUserId = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.id;
    const result = await UserCardSErvice.getUserCardDetailsByUserId(userId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User card details reterive successfully",
      data: result,
    });
  }
);

export const UserCardDetailsController = {
  createUserCardDetails,
  getUserCardDetails,
  getUserCardDetailsByUserId,
};
