import prisma from "../../../shared/prisma";
import { TContactInfo } from "./contactInfo.interface";

const createContactInfoIntoDB = async (payload:TContactInfo) => {
  try {
    const result = await prisma.contactInfo.create({
      data: {
       firstName:payload.firstName,
       lastName:payload.lastName,
       email:payload.email,
       mobileNo:payload.mobileNo,
      },
    });
    return result;
  } catch (error: any) {
    throw new Error(`Could not create contact info: ${error.message}`);
  }
};

const getAllContactInfoFromDB = async () => {
  try {
    const result = await prisma.contactInfo.findMany();
    return result;
  } catch (error: any) {
    throw new Error(`Could not get contact info: ${error.message}`);
  }
};

export const contactInfoServices = { createContactInfoIntoDB, getAllContactInfoFromDB };
