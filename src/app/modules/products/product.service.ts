import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
<<<<<<< HEAD
import { carStatusEnum, categoryEnum, TProducts } from "./product.interface";
import { json } from "stream/consumers";


=======
import {
  carStatusEnum,
  categoryEnum,
  TProductImage,
  TProducts,
} from "./product.interface";
>>>>>>> 2654e668ff32cdd16eaac137525dfb6d554469c3

const createProductIntoDB = async (filesData: any, payload: any) => {

  try {
    let productData: TProducts = JSON.parse(payload.data);
  
    const existingProduct = await prisma.products.findUnique({
      where: {
        productName: payload.productName,
      },
    });

    if (existingProduct) {
      throw new ApiError(httpStatus.CONFLICT, "This product already exists!");
    }

    // Set your default type here
    // Process filesData to extract image URLs and set a default type
    const processedImages = filesData.map((file: any) => ({
      images: file.secure_url,
      imageType: payload.imageType,
    }));

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
        ManufactureCountry: productData.ManufactureCountry,
        status: productData.status,
        category: productData.category,
        isDeleted: false,
        productImage: processedImages,
      },
    });

    return result;
  } catch (error) {
    throw new Error(`Could not create product: ${error}`);
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
        price: "desc"
      },

      include: {
        brand: true, // Assuming the relation is named brand
      },
    });
    return result;
  } catch (error) {
    throw new Error(`Could not get products: ${error}`);
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
<<<<<<< HEAD
=======
        Review: true,
>>>>>>> 2654e668ff32cdd16eaac137525dfb6d554469c3
      },
    });

    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, "Product not found!");
    }

    return result;
  } catch (error) {
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
<<<<<<< HEAD
        isDeleted: payload.isDeleted !== undefined ? payload.isDeleted : existingProduct.isDeleted,
        productImage: payload.productImage !== undefined ? payload.productImage : existingProduct.productImage,
=======
        isDeleted:
          payload.isDeleted !== undefined
            ? payload.isDeleted
            : existingProduct.isDeleted,
        productImage: payload.productImage
          ? {
              deleteMany: {},
              create: payload.productImage.map((image: TProductImage) => ({
                image: image.image,
                imageType: image.imageType,
              })),
            }
          : undefined,
>>>>>>> 2654e668ff32cdd16eaac137525dfb6d554469c3
      },
    });

    return result;
  } catch (error) {
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
  } catch (error) {
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
