import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";

import { json } from "stream/consumers";

import { carStatusEnum, categoryEnum, TProducts } from "./product.interface";

const createProductIntoDB = async (filesData: any, payload: any) => {
  const { productURL,interiorURL,expteriorURL,othersURL}=filesData;

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
        productImage: productURL,
        interiorImage: interiorURL,
        exteriorImage: expteriorURL,
        othersImages:othersURL,
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

const getAllProductsFromDB = async (query: {
  status?: carStatusEnum;
  category?: categoryEnum;
  searchTerms: any;
}) => {
  try {
    const andSearchCondition: any[] = [{ isDeleted: false }];
    if (query.category || query.status || query.searchTerms) {
      andSearchCondition.push({
        status: query.status ? query.status : undefined,
        category: query.category ? query.category : undefined,
        OR: ["productName", "ManufactureCountry"].map((field) => ({
          [field]: {
            contains: query.searchTerms,
            mode: "insensitive",
          },
        })),
      });
    }
    const whereConditions = { AND: andSearchCondition };
    const result = await prisma.products.findMany({
      where: whereConditions,
      orderBy: {
        price: "desc",
      },
      include: {
        brand: true, // Assuming the relation is named brand
      },
    });
    return result;
  } catch (error: any) {
    throw new Error(`Could not get products: ${error.message}`);
  }
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
