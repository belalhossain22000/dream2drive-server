import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { brandServices } from "./brands.services";


const createBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await brandServices.createBrandIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand created successfully!",
    data: result,
  });
});

const getAllBrands = catchAsync(async (req: Request, res: Response) => {
  const result = await brandServices.getAllBrandsIntoDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brands retrieved successfully",
    data: result,
  });
});

export const brandController = {
  createBrand,
  getAllBrands,
};
