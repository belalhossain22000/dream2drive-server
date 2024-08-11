import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

import { json } from "stream/consumers";

import { carStatusEnum, categoryEnum, TProducts } from "./product.interface";
import { IPaginationOptions } from "../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma } from "@prisma/client";
import { productsSearchAbleFields } from "./product.constants";

const createProductIntoDB = async (filesData: any, payload: any) => {
  const { productURL, interiorURL, expteriorURL, othersURL,singleImageURL} = filesData;

  try {
    // console.log(payload);
    let productData: TProducts = JSON.parse(payload);
    console.log(productData);
    const existingProduct = await prisma.products.findUnique({
      where: {
        productName: productData.productName,
      },
    });
    if (existingProduct) {
      throw new ApiError(httpStatus.CONFLICT, "This product already exists!");
    }
    const result = await prisma.products.create({
      data: {
        productName: productData.productName,
        ProductDescription: productData.ProductDescription,
        auction: productData.auction,
        price: productData.price,
        auctionStartDate: productData.auctionStartDate,
        auctionEndDate: productData.auctionEndDate,
        brandId: productData.brandId.toString(),
        drivingPosition: productData.drivingPosition,
        totalCarRun: productData.totalCarRun,
        gearType: productData.gearType,
        carMetal: productData.carMetal,
        leatherMaterial: productData.leatherMaterial,
        carsInline: productData.carsInline,
        vin: productData.vin,
        lot: productData.lot,
        productSingleImage:singleImageURL,
        productImage: productURL,
        interiorImage: interiorURL,
        exteriorImage: expteriorURL,
        othersImages: othersURL,
        keyFacts: productData.keyFacts,
        equipmentAndFeature: productData.keyFacts,
        condition: productData.condition,
        serviceHistory: productData.serviceHistory,
        summary: productData.summary,
        ManufactureCountry: productData.ManufactureCountry,
        status: productData.status,
        category: productData.category,
        isDeleted: false,
      },
    });
    return result;
  } catch (error: any) {
    throw new Error(`Could not create product: ${error.message}`);
  }
};
const getAllProductsFromDB = async (
  params: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondions: Prisma.ProductsWhereInput[] = [];

  //console.log(filterData);
  if (params.searchTerm) {
    andCondions.push({
      OR: productsSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  andCondions.push({
    isDeleted: false,
  });

  //console.dir(andCondions, { depth: 'inifinity' })
  const whereConditons: Prisma.ProductsWhereInput = { AND: andCondions };

  const result = await prisma.products.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.products.count({
    where: whereConditons,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleProductFromDB = async (id: string) => {
  try {
    const result = await prisma.products.findUnique({
      where: {
        id: id,
      },
      include: {
        brand: true,
        Review: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, "Product not found!");
    }

    return result;
  } catch (error: any) {
    throw new Error(`Could not get product: ${error}`);
  }
};

const updateProductInDB = async (id: string, payload: Partial<TProducts>) => {
  try {
    const existingProduct = await prisma.products.findUnique({
      where: { id: id },
    });

    if (!existingProduct) {
      throw new ApiError(httpStatus.NOT_FOUND, "Product not found!");
    }

    const result = await prisma.products.update({
      where: { id: id },
      data: {
        productName: payload.productName || existingProduct.productName,
        ProductDescription:
          payload.ProductDescription || existingProduct.ProductDescription,
        auction: payload.auction || existingProduct.auction,
        price: payload.price || existingProduct.price,
        brandId: payload.brandId
          ? payload.brandId.toString()
          : existingProduct.brandId,
        drivingPosition:
          payload.drivingPosition || existingProduct.drivingPosition,
        ManufactureCountry:
          payload.ManufactureCountry || existingProduct.ManufactureCountry,
        status: payload.status || existingProduct.status,
        category: payload.category || existingProduct.category,
        keyFacts: payload.keyFacts || existingProduct.keyFacts,
        equipmentAndFeature:
          payload.equipmentAndFeature || existingProduct.equipmentAndFeature,
        condition: payload.condition || existingProduct.condition,
        serviceHistory:
          payload.serviceHistory || existingProduct.serviceHistory,
        summary: payload.summary || existingProduct.summary,
        isDeleted:
          payload.isDeleted !== undefined
            ? payload.isDeleted
            : existingProduct.isDeleted,
        productImage: payload.productImage
          ? {
              deleteMany: {},
              create: payload.productImage.map((image: any) => ({
                image: image.image,
                imageType: image.imageType,
              })),
            }
          : undefined,
      },
    });

    return result;
  } catch (error: any) {
    throw new Error(`Could not update product: ${error}`);
  }
};

const deleteProductFromDB = async (id: string) => {
  try {
    const existingProduct = await prisma.products.findUnique({
      where: { id: id },
    });

    if (!existingProduct) {
      throw new ApiError(httpStatus.NOT_FOUND, "Product not found!");
    }

    const result = await prisma.products.update({
      where: { id: id },
      data: {
        isDeleted: true,
      },
    });

    return { message: "Product  deleted successfully!", result };
  } catch (error: any) {
    throw new Error(`Could not  delete product: ${error}`);
  }
};

const createFeaturedProduct = async (id: string) => {
  console.log(id);
  // Unfeatured the currently featured product

  const currentFeatured = await prisma.products.findFirst({
    where: { featured: true },
  });

  if (currentFeatured) {
    await prisma.products.update({
      where: { id: currentFeatured.id },
      data: { featured: false },
    });
  }

  // Feature the selected product
  const product = await prisma.products.update({
    where: { id },
    data: { featured: true },
  });

  return { message: "Product featured successfully!", product };
};

const getFeaturedProduct = async () => {
  // Unfeatured the currently featured product
  console.log("featured product");

  const currentFeatured = await prisma.products.findFirstOrThrow({
    where: { featured: true },
  });

  return currentFeatured;
};

export const productServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  deleteProductFromDB,
  updateProductInDB,
  createFeaturedProduct,
  getFeaturedProduct,
};
