import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { contactInfoServices } from "./contactInfo.services";

const createContactInfo = catchAsync(async (req: Request, res: Response) => {
  const result = await contactInfoServices.createContactInfoIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ContactInfo created successfully!",
    data: result,
  });
});

const getAllContactInfos = catchAsync(async (req: Request, res: Response) => {
  const result = await contactInfoServices.getAllContactInfoFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ContactInfos retrieved successfully",
    data: result,
  });
});

export const ContactInfoController = {
  createContactInfo,
  getAllContactInfos,
};
