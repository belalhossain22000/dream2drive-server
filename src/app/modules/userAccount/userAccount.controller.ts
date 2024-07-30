import { Request, Response, NextFunction } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import stripe from "../../../helpars/stripe";
import { paymentService } from "./userAccount.service";

const validateCards = async (req: Request, res: Response) => {
  const { token } = req.body; // Token ID received from the frontend

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const paymentMethod = await stripe.paymentMethods.retrieve(token);

    // Check if the payment method is valid
    if (paymentMethod) {
      return res.status(200).json({ valid: true });
    } else {
      return res.status(400).json({ valid: false, error: "Invalid token" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// create user bank account

const createUserBankAccount = catchAsync(
  async (req: Request, res: Response) => {
    const result = await paymentService.createUserBankAccountIntoDb(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Bank Details Created successfully!",
      data: result,
    });
  }
);
const getAllUserBankAccount = catchAsync(
  async (req: Request, res: Response) => {
    const result = await paymentService.getAllUserAccountDetailsFromDB();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Bank Details Created successfully!",
      data: result,
    });
  }
);

export const paymentController = {
  validateCards,
  createUserBankAccount,
  getAllUserBankAccount,
};
