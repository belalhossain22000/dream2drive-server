import { Request, Response, NextFunction } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import stripe from "../../../helpars/stripe";
import { paymentService } from "./userAccount.service";
import prisma from "../../../shared/prisma";

const validateCards = catchAsync(async (req: Request, res: Response) => {
  try {
    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: ["card"],
    });
    res.status(200).json({ clientSecret: setupIntent.client_secret });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});
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
