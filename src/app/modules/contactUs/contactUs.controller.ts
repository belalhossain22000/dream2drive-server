import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { contactUsService } from "./contactUs.service";


const contactUsSourcingEmailSend = catchAsync(
  async (req: Request, res: Response) => {
    const result = await contactUsService.contactUsEmailSend(
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Email Send successfully!",
      data: null,
    });
  }
);

export const contactUsSourcingController = {
    contactUsSourcingEmailSend,
};
