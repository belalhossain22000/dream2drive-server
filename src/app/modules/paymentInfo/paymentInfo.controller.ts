import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { paymentInfoService } from "./paymentInfo.services";

const createPaymentInfo = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentInfoService.createpaymentInfoIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " paymentInfo created successfully",
    data: result,
  });
});

const getPaymentInfo = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentInfoService.getpaymentInfoIntoDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " paymentInfo created successfully",
    data: result,
  });
});
const getPaymentInfoByUserId = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await paymentInfoService.getpaymentInfoByUserIntoDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: " paymentInfo with Id created successfully",
      data: result,
    });
  }
);

export const paymentInfoController = {
  createPaymentInfo,
  getPaymentInfo,
  getPaymentInfoByUserId,
};
