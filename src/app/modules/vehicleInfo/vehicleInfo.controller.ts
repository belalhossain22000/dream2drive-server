import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { VehicleInfoServices } from "./vehicleInfo.services";
import { fileUploader } from "../../../helpars/fileUploader";

const createVehicleInfo = catchAsync(async (req: Request, res: Response) => {
  // Extract the single file from req.files
  const file = req.files as any;

  if (!file || file.length === 0) {
    return res.status(400).send({ message: "No file uploaded!" });
  }

  // Since it's a single file, we do not need to map over an array
  const carImage = {
    fileName: file.filename,
    url: `/uploads/${file.originalname}`,
  };
  console.log(carImage);
  // Assuming you have a VehicleInfo service to handle DB logic
  // const result = await VehicleInfoServices.createVehicleInfoIntoDB(carImage, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vehicle info created successfully!",
    data: null,
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
