import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { TVehicleInfo } from "./vehicleInfo.interface";

const createVehicleInfoIntoDB = async (
  files: any,
  payload: any,
  userId: string
) => {
  let parseData;
  try {
    parseData = JSON.parse(payload?.text);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "please check your input");
  }
  const vehicleInfo = { ...parseData, carImage: files, userId };
  const result = await prisma.vehicleInfo.create({
    data: vehicleInfo,
  });
  if (!result)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "failed to create vehicle"
    );
  return result;
};

const getAllVehicleInfoFromDB = async () => {
  try {
    const result = await prisma.vehicleInfo.findMany({
      include: {
        user: true,
      },
    });
    return result;
  } catch (error: any) {
    throw new Error(`Could not get vehicle info: ${error.message}`);
  }
};

// delete vehicle from deb

const deleteVehicleFromDB = async (vehicleId: string) => {
  await prisma.vehicleInfo.findFirstOrThrow({
    where: { id: vehicleId },
  });

  const result = await prisma.vehicleInfo.delete({
    where: { id: vehicleId },
  });
  return result;
};

export const VehicleInfoServices = {
  createVehicleInfoIntoDB,
  getAllVehicleInfoFromDB,
  deleteVehicleFromDB,
};
