import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { vehicleSourcingService } from "./vehicleSourcing.service";

const vehicleSourcingEmailSend = catchAsync(
  async (req: Request, res: Response) => {
    const result = await vehicleSourcingService.vehicleSourcingEmailSend(
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

export const vehicleSourcingController = {
  vehicleSourcingEmailSend,
};
