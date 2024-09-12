import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { VehicleInfoServices } from "./vehicleInfo.services";
import { fileUploader } from "../../../helpars/fileUploader";

const createVehicleInfo = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    throw new Error("file was not aaded!!");
  }

  const result = await VehicleInfoServices.createVehicleInfoIntoDB(
    `/uploads/${file.originalname}`,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "VehicleInfo created successfully!",
    data: result,
  });
});

//
const getAllVehicleInfos = catchAsync(async (req: Request, res: Response) => {
  const result = await VehicleInfoServices.getAllVehicleInfoFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "VehicleInfo retrieved successfully",
    data: result,
  });
});

const deleteVehicle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await VehicleInfoServices.deleteVehicleFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "VehicleInfo deleted successfully",
    data: result,
  });
});

export const VehicleInfoController = {
  createVehicleInfo,
  getAllVehicleInfos,
  deleteVehicle,
};
