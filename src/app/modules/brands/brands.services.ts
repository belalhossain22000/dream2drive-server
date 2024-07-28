import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import { TBrand } from "./brands.interface";
import ApiError from "../../errors/ApiErrors";

const createBrandIntoDB = async (payload:TBrand) => {
  try {
    // Validate payload using Zod sche
  const existingBrands=await prisma.brand.findUnique({
    where:{
      brandName:payload.brandName
    }
  });
  if(existingBrands){
    throw new ApiError(httpStatus.CONFLICT,"this Brands is already exists!!");
  }
    const result = await prisma.brand.create({
      data: {
        brandName: payload.brandName,
      },
    });
    return result;
  } catch (error) {
    throw new Error(`Could not create brand: ${error.message}`);
  }
};

const getAllBrandsIntoDB = async () => {
  try {
    const result = await prisma.brand.findMany();
    return result;
  } catch (error) {
    throw new Error(`Could not get brands: ${error.message}`);
  }
};

export const brandServices = { createBrandIntoDB, getAllBrandsIntoDB };
