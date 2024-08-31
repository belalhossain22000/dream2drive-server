// src/controllers/orderController.ts
import { Request, Response } from "express";
import { createPaymentIntent } from "./payment.services";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createPaymentIntentController = catchAsync(async (req: Request, res: Response) => {
  const clientSecret = await createPaymentIntent(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Review created successfully",
    data: clientSecret,
  });
});
export const paymentControllers = {
  createPaymentIntentController,
};
