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

// update brand

const updateBrandIntoDB = async (id: string, payload: TBrand) => {
  const existingBrands = await prisma.brand.findUnique({
    where: {
      id: id,
    },
  });

  if (!existingBrands) {
    throw new ApiError(httpStatus.NOT_FOUND, "Brand not found!");
  }

  const result = await prisma.brand.update({
    where: {
      id: id,
    },
    data: {
      brandName: payload.brandName,
    },
  });

  return result;
};

// delete brand

const deleteBrandIntoDB = async (id: string) => {
  const existingBrands = await prisma.brand.findUnique({
    where: {
      id: id,
    },
  });
  const productsWithBrandId = await prisma.product.findMany({
    where: {
      brandId: id,
    },
  });
  
  // Check if any products are found
  if (productsWithBrandId.length > 0) {
    throw new Error('A product with this brandId already exists.');
  }
  
  // Proceed with your logic if no products are found
  

  if (!existingBrands) {
    throw new ApiError(httpStatus.NOT_FOUND, "Brand not found!");
  }

  const result = await prisma.brand.delete({
    where: {
      id: id,
    },
  });

  return result;
};

export const brandServices = {
  createBrandIntoDB,
  getAllBrandsIntoDB,
  updateBrandIntoDB,
  deleteBrandIntoDB,
};
