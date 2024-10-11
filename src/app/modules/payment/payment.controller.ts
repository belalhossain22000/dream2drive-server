// src/controllers/orderController.ts
import { Request, Response } from "express";
import { createPaymentIntent, paymentService } from "./payment.services";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createPaymentIntentController = catchAsync(
  async (req: Request, res: Response) => {
    const clientSecret = await createPaymentIntent(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: " Payment intent created successfully",
      data: clientSecret,
    });
  }
);

const updatePaymentIntentController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const clientSecret = await paymentService.updatePaymentIntent(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: " Payment intent updated successfully",
      data: clientSecret,
    });
  }
);
export const paymentControllers = {
  createPaymentIntentController,
  updatePaymentIntentController,
  
};
