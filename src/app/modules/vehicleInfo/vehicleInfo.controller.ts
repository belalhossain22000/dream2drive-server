import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { VehicleInfoServices } from "./vehicleInfo.services";
import { fileUploader } from "../../../helpars/fileUploader";

const createVehicleInfo = catchAsync(async (req: Request, res: Response) => {
  
  const file=req.file;
  // console.log(file);
    if(!file){
      throw new Error("file was not aaded!!");

    }

    const vehicleImage=fileUploader.uploadToCloudinary(file as any);
    const vehicleImageData = await vehicleImage;
   const vehicleImageLink=vehicleImageData?.secure_url;

  //  console.log(req.body)

    const result = await VehicleInfoServices.createVehicleInfoIntoDB(vehicleImageLink,req.body);
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

export const VehicleInfoController = {
  createVehicleInfo,
  getAllVehicleInfos,
};
