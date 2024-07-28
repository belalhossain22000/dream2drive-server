import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { userServices } from "./user.services";
import { Request, Response } from "express";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.createAdminIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Brand created successfully!",
        data: result,
    });
});
const getAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.createAdminIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Brand created successfully!",
        data: result,
    });
});

export const userController = {
    createAdmin,getAdmin
}