import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { carStatusEnum, categoryEnum, TProducts } from "./product.interface";



const createProductIntoDB = async (payload: TProducts) => {
  console.log(payload);
  try {
    const existingProduct = await prisma.products.findUnique({
      where: {
        productName: payload.productName,
      },
    });

    if (existingProduct) {
      throw new ApiError(httpStatus.CONFLICT, 'This product already exists!');
    }

    const result = await prisma.products.create({
      data: {
        productName: payload.productName,
        ProductDescription: payload.ProductDescription,
        auction: payload.auction,
        price: payload.price,
        brandId: payload.brandId.toString(),
        drivingPosition: payload.drivingPosition,
        ManufactureCountry: payload.ManufactureCountry,
        status: payload.status,
        category: payload.category,
        isDeleted: false,
        productImage: {
          create: payload.productImages.map(image=> ({
            image: image.image,
            imageType: image.imageType,
          }))
        }
      },
    });

    // return result;
  } catch (error) {
    throw new Error(`Could not create product: ${error}`);
  }
};


const getAllProductsFromDB = async (query: { status?: carStatusEnum, category?: categoryEnum, searchTerms: any }) => {
  try {
    const andSearchCondition = [];
    if (query.category || query.status || query.searchTerms) {
      andSearchCondition.push({
        status: query.status ? query.status : undefined,
        category: query.category ? query.category : undefined,
        OR: ['productName', 'ManufactureCountry'].map(field => ({
          [field]: {
            contains: query.searchTerms,
            mode: 'insensitive'
          }
        }))
      },)
    }
    const whereConditions = { AND: andSearchCondition }
    const result = await prisma.products.findMany({
      where: whereConditions,
      include: {
        brand: true, // Assuming the relation is named brand
      },
    });
    return result;
  } catch (error) {
    throw new Error(`Could not get products: ${error.message}`);
  }
};



export const productServices = { createProductIntoDB, getAllProductsFromDB };
