import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { IPaginationOptions } from "../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { DrivingSide, Prisma, ProductStatus } from "@prisma/client";
import { productsSearchAbleFields } from "./product.constants";
import { TProducts } from "./product.interface";
import normalizeDrivingSide from "../../../shared/normalizedDrivingSide";
import normalizeStatus from "../../../shared/normalizedStatus";
import { JsonArray } from "@prisma/client/runtime/library";
// import normalizeDrivingSide from "../../../shared/normalizedDrivingSide";

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
      lotNumbers: productData.lotNumbers,
      isDeleted: false,
      featured: false,
      status: productData.status,
      sellerEmail: productData.sellerEmail,
      sellerPhoneNumber: productData.sellerPhoneNumber,
      sellerName: productData.sellerName,
      region: productData.region,
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
  // console.log(filterData,"================================================================================================")
  const andConditions: Prisma.ProductWhereInput[] = [];

  // Normalize searchTerm and filterData for case sensitivity
  const normalizedSearchTerm = searchTerm?.toLowerCase() || "";

  // Searching
  if (normalizedSearchTerm) {
    andConditions.push({
      OR: productsSearchAbleFields.map((field) => {
        if (field === "brand.brandName") {
          return {
            brand: {
              brandName: {
                contains: normalizedSearchTerm,
                mode: "insensitive",
              },
            },
          };
        } else if (field === "drivingSide") {
          const normalizedDrivingSide =
            normalizeDrivingSide(normalizedSearchTerm);
          if (normalizedDrivingSide) {
            return {
              drivingSide: normalizedDrivingSide,
            };
          } else {
            return {}; // Skip if searchTerm is not valid for enum
          }
        } else if (field === "status") {
          const normalizedStatus = normalizeStatus(normalizedSearchTerm);
          if (normalizedStatus) {
            return {
              status: normalizedStatus,
            };
          } else {
            return {}; // Skip if searchTerm is not valid for enum
          }
        }
        return {
          [field]: {
            contains: normalizedSearchTerm,
            mode: "insensitive",
          },
        };
      }),
    });
  }

  // Filtering
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        let value = (filterData as any)[key];

        // Handle boolean string conversion
        if (value === "true") value = true;
        if (value === "false") value = false;

        // Special handling for status
        if (key === "status") {
          const normalizedStatus = normalizeStatus(value);
          if (normalizedStatus) {
            return {
              status: normalizedStatus,
            };
          } else {
            return {}; // Skip if value is not valid for enum
          }
        }

        // Special handling for drivingSide enum
        if (key === "drivingSide") {
          const normalizedDrivingSide = normalizeDrivingSide(value);
          if (normalizedDrivingSide) {
            return {
              drivingSide: normalizedDrivingSide,
            };
          } else {
            return {}; // Skip if value is not valid for enum
          }
        }

        // Special handling for brand filtering
        if (key === "brand") {
          return {
            brand: {
              brandName: {
                equals: value,
                mode: "insensitive",
              },
            },
          };
        }

        return {
          [key]: {
            equals: value,
            mode: "insensitive",
          },
        };
      }) as Prisma.ProductWhereInput[], // Cast the result as Prisma.ProductWhereInput[]
    });
  }

  // Always exclude deleted products
  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.ProductWhereInput = { AND: andConditions };

  const result = await prisma.product.findMany({
    where: whereConditions,
    include: {
      brand: true,
      user: true,
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
    where: whereConditions,
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

//
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

// *! update product
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
      productName: payload.productName ?? existingProduct?.productName,
      singleImage:
        payload.singleImage ?? (existingProduct?.singleImage as JsonArray),
      keyFacts: payload.keyFacts ?? existingProduct?.keyFacts,
      equepmentAndFeature:
        payload.equepmentAndFeature ?? existingProduct?.equepmentAndFeature,
      condition: payload.condition ?? existingProduct?.condition,
      serviceHistory: payload.serviceHistory ?? existingProduct?.serviceHistory,
      summary: payload.summary ?? existingProduct?.summary,
      youtubeVideo: payload.youtubeVideo ?? existingProduct?.youtubeVideo,
      galleryImage: payload.galleryImage ?? existingProduct?.galleryImage,
      exteriorImage: payload.exteriorImage ?? existingProduct?.exteriorImage,
      interiorImage: payload.interiorImage ?? existingProduct?.interiorImage,
      othersImage: payload.othersImage ?? existingProduct?.othersImage,
      auctionStartDate:
        payload.auctionStartDate ?? existingProduct?.auctionStartDate,
      auctionEndDate: payload.auctionEndDate ?? existingProduct?.auctionEndDate,
      brandId: payload.brandId ?? existingProduct?.brandId,
      speed: payload.speed ?? existingProduct?.speed,
      price: payload.price ?? existingProduct?.price,
      gear: payload.gear ?? existingProduct?.gear,
      drivingSide: payload.drivingSide ?? existingProduct?.drivingSide,
      color: payload.color ?? existingProduct?.color,
      interior: payload.interior ?? existingProduct?.interior,
      engine: payload.engine ?? existingProduct?.engine,
      vin: payload.vin ?? existingProduct?.vin,
      country: payload.country ?? existingProduct?.country,
      isDeleted:
        payload.isDeleted !== undefined
          ? payload.isDeleted
          : existingProduct?.isDeleted,
      featured:
        payload.featured !== undefined
          ? payload.featured
          : existingProduct?.featured,
      status: payload.status ?? existingProduct?.status,
      region: payload.region ?? existingProduct?.region,
      sellerEmail: payload.sellerEmail ?? existingProduct?.sellerEmail,
      sellerPhoneNumber:
        payload.sellerPhoneNumber ?? existingProduct?.sellerPhoneNumber,
      sellerName: payload.sellerName ?? existingProduct?.sellerName,
      lotNumbers: payload.lotNumbers ?? existingProduct?.lotNumbers,
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

const getProductGroupings = async () => {
  // Fetch all products from the database with related brand data
  const products = await prisma.product.findMany({
    include: {
      brand: true, // Include the brand information
    },
  });

  // Initialize grouping objects
  const regionGroup: Record<string, number> = {};
  const countryGroup: Record<string, number> = {};
  const drivingSideGroup: Record<string, number> = {};
  const brandGroup: Record<string, number> = {};

  // Group and count products by region, country, drivingSide, and brandName
  products.forEach((product) => {
    // Group by region
    if (product.region) {
      if (!regionGroup[product.region]) {
        regionGroup[product.region] = 0;
      }
      regionGroup[product.region]++;
    }

    // Group by country
    if (product.country) {
      if (!countryGroup[product.country]) {
        countryGroup[product.country] = 0;
      }
      countryGroup[product.country]++;
    }

    // Group by drivingSide
    if (product.drivingSide) {
      if (!drivingSideGroup[product.drivingSide]) {
        drivingSideGroup[product.drivingSide] = 0;
      }
      drivingSideGroup[product.drivingSide]++;
    }

    // Group by brandName
    if (product.brand?.brandName) {
      if (!brandGroup[product.brand.brandName]) {
        brandGroup[product.brand.brandName] = 0;
      }
      brandGroup[product.brand.brandName]++;
    }
  });

  // Convert group objects to arrays of strings with counts
  const regionList = Object.entries(regionGroup).map(
    ([region, count]) => `${region} (${count})`
  );

  const countryList = Object.entries(countryGroup).map(
    ([country, count]) => `${country} (${count})`
  );

  const drivingSideList = Object.entries(drivingSideGroup).map(
    ([drivingSide, count]) => `${drivingSide} (${count})`
  );

  const brandList = Object.entries(brandGroup).map(
    ([brandName, count]) => `${brandName} (${count})`
  );

  // Return the formatted lists
  return {
    region: regionList,
    country: countryList,
    drivingSide: drivingSideList,
    brand: brandList,
  };
};

export const productServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  deleteProductFromDB,
  updateProductInDB,
  createFeaturedProduct,
  getFeaturedProduct,
  getProductGroupings,
};
