import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import { TBrand } from "./brands.interface";
import ApiError from "../../errors/ApiErrors";

const createBrandIntoDB = async (payload: TBrand) => {
  const existingBrands = await prisma.brand.findUnique({
    where: {
      brandName: payload.brandName,
    },
  });
  if (existingBrands) {
    throw new ApiError(httpStatus.CONFLICT, "this Brands is already exists!!");
  }
  const result = await prisma.brand.create({
    data: {
      brandName: payload.brandName,
    },
  });

  return result;
};

const getAllBrandsIntoDB = async () => {
  const result = await prisma.brand.findMany();
  const results = result.map((el) => ({ id: el.id, name: el.brandName }));

  if (!results) {
    throw new ApiError(httpStatus.NOT_FOUND, "No brands found");
  }

  return results;
};

export const brandServices = { createBrandIntoDB, getAllBrandsIntoDB };
