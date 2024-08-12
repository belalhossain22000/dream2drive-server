import prisma from "../../../shared/prisma";
import { TVehicleInfo } from "./vehicleInfo.interface";

const createVehicleInfoIntoDB = async (files: any, payload: any) => {
  try {
    const parseData: TVehicleInfo = JSON.parse(payload?.text);
    console.log(parseData);
    const result = await prisma.vehicleInfo.create({
      data: {
        firstName: parseData.firstName,
        lastName: parseData.lastName,
        email: parseData.email,
        mobileNo: parseData.mobileNo,
        carMake: parseData.carMake,
        carDetails: parseData.carDetails,
        carImage: files,
        aboutHear: parseData.aboutHear,
      },
    });
    return result;
  } catch (error: any) {
    throw new Error(`Could not create vehicle info: ${error.message}`);
  }
};

const getAllVehicleInfoFromDB = async () => {
  try {
    const result = await prisma.vehicleInfo.findMany();
    return result;
  } catch (error: any) {
    throw new Error(`Could not get vehicle info: ${error.message}`);
  }
};

export const VehicleInfoServices = {
  createVehicleInfoIntoDB,
  getAllVehicleInfoFromDB,
};
