import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { IPaginationOptions } from "../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma } from "@prisma/client";
import { productsSearchAbleFields } from "./product.constants";
import { TProducts } from "./product.interface";

const createProductIntoDB = async (filesData: any, payload: any) => {
  const {
    galleryImage,
    interiorImage,
    exteriorImage,
    othersImage,
    singleImage,
  } = filesData;
  console.log(filesData);
  let productData: TProducts = JSON.parse(payload);

  const existingProduct = await prisma.product.findFirst({
    where: {
      productName: productData.productName,
    },
  });
  if (existingProduct) {
    throw new ApiError(
      400,
      `product already exist by this name ${productData.productName}`
    );
  }
  const isBrandExist = await prisma.brand.findFirst({
    where: {
      id: productData.brandId,
    },
  });

  if (!isBrandExist) {
    throw new ApiError(
      400,
      `brand is not exist you provide ${productData.brandId}`
    );
  }

  const result = await prisma.product.create({
    data: {
      productName: productData.productName,
      singleImage: singleImage,
      keyFacts: productData.keyFacts,
      userId: productData.userId,
      equepmentAndFeature: productData.equepmentAndFeature,
      condition: productData.condition,
      serviceHistory: productData.serviceHistory,
      summary: productData.summary,
      youtubeVideo: productData.youtubeVideo,
      galleryImage: galleryImage,
      exteriorImage: exteriorImage,
      interiorImage: interiorImage,
      othersImage: othersImage,
      auctionStartDate: productData.auctionStartDate,
      auctionEndDate: productData.auctionEndDate,
      brandId: productData.brandId,
      speed: productData.speed,
      price: productData.price,
      gear: productData.gear,
      drivingSide: productData.drivingSide,
      color: productData.color,
      interior: productData.interior,
      engine: productData.engine,
      vin: productData.vin,
      country: productData.country,
      isDeleted: false,
      featured: false,
      status: productData.status,
    },
  });
  return result;
};

// get all data with filtering
const getAllProductsFromDB = async (
  params: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondions: Prisma.ProductWhereInput[] = [];

  // searching
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

  // filtering
  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => {
        let value = (filterData as any)[key];

        // Handle boolean string conversion
        if (value === "true") value = true;
        if (value === "false") value = false;

        return {
          [key]: {
            equals: value,
          },
        };
      }),
    });
  }

  andCondions.push({
    isDeleted: false,
  });

  //console.dir(andCondions, { depth: 'inifinity' })
  const whereConditons: Prisma.ProductWhereInput = { AND: andCondions };

  const result = await prisma.product.findMany({
    where: whereConditons,
    include: {
      brand: true,
      user:true
    },
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

  const total = await prisma.product.count({
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
  const result = await prisma.product.findUnique({
    where: {
      id: id,
    },
    include: {
      brand: true,
      reviews: true,
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found!");
  }
  return result;
};

const updateProductInDB = async (id: string, payload: Partial<TProducts>) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id: id },
  });

  if (!existingProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found!");
  }

  const result = await prisma.product.update({
    where: { id: id },
    data: {
      productName: payload.productName || existingProduct.productName,
      singleImage: payload.singleImage,
      keyFacts: payload.keyFacts || existingProduct.keyFacts,
      equepmentAndFeature:
        payload.equepmentAndFeature || existingProduct.equepmentAndFeature,
      condition: payload.condition || existingProduct.condition,
      serviceHistory: payload.serviceHistory || existingProduct.serviceHistory,
      summary: payload.summary || existingProduct.summary,
      youtubeVideo: payload.youtubeVideo || existingProduct.youtubeVideo,
      galleryImage: payload.galleryImage || existingProduct.galleryImage,
      exteriorImage: payload.exteriorImage || existingProduct.exteriorImage,
      interiorImage: payload.interiorImage || existingProduct.interiorImage,
      othersImage: payload.othersImage || existingProduct.othersImage,
      auctionStartDate:
        payload.auctionStartDate || existingProduct.auctionStartDate,
      auctionEndDate: payload.auctionEndDate || existingProduct.auctionEndDate,
      brandId: payload.brandId || existingProduct.brandId,
      speed: payload.speed || existingProduct.speed,
      price: payload.price || existingProduct.price,
      gear: payload.gear || existingProduct.gear,
      drivingSide: payload.drivingSide || existingProduct.drivingSide,
      color: payload.color || existingProduct.color,
      interior: payload.interior || existingProduct.interior,
      engine: payload.engine || existingProduct.engine,
      vin: payload.vin || existingProduct.vin,
      country: payload.country || existingProduct.country,
      isDeleted:
        payload.isDeleted !== undefined
          ? payload.isDeleted
          : existingProduct.isDeleted,
      featured:
        payload.featured !== undefined
          ? payload.featured
          : existingProduct.featured,
      status: payload.status || existingProduct.status,
    },
  });

  return result;
};

const deleteProductFromDB = async (id: string) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id: id },
  });

  if (!existingProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found!");
  }

  const result = await prisma.product.update({
    where: { id: id },
    data: {
      isDeleted: true,
    },
  });

  return { message: "Product  deleted successfully!", result };
};

const createFeaturedProduct = async (id: string) => {
  console.log(id);
  // Unfeatured the currently featured product

  const currentFeatured = await prisma.product.findFirst({
    where: { featured: true },
  });

  if (currentFeatured) {
    await prisma.product.update({
      where: { id: currentFeatured.id },
      data: { featured: false },
    });
  }

  // Feature the selected product
  const product = await prisma.product.update({
    where: { id },
    data: { featured: true },
  });

  return { message: "Product featured successfully!", product };
};

const getFeaturedProduct = async () => {
  // Unfeatured the currently featured product
  // console.log("featured product");

  const currentFeatured = await prisma.product.findFirstOrThrow({
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
