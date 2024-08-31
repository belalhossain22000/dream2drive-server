import prisma from "../../../shared/prisma";
import { TVehicleInfo } from "./vehicleInfo.interface";

const createVehicleInfoIntoDB = async (files: any, payload: any) => {
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
};

const getAllVehicleInfoFromDB = async () => {
  try {
    const result = await prisma.vehicleInfo.findMany();
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
  deleteVehicleFromDB
};
