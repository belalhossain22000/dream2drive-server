import httpStatus from "http-status";
import cron from "node-cron";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { IPaginationOptions } from "../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma, ProductStatus } from "@prisma/client";
import { productsSearchAbleFields } from "./product.constants";
import { TProducts } from "./product.interface";

import normalizeStatus from "../../../shared/normalizedStatus";
import { JsonArray } from "@prisma/client/runtime/library";
import emailSender from "../Autrh/emailSender";

const createProductIntoDB = async (
  filesData: any,
  payload: any,
  userId: string
) => {
  const {
    galleryImage,
    // interiorImage,
    // exteriorImage,
    // othersImage,
    singleImage,
  } = filesData;

  let productData: TProducts = JSON.parse(payload);
  productData.userId = userId;
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

  // checking is seller is exist
  const isSellerExist = await prisma.user.findUnique({
    where: {
      email: productData.sellerEmail,
    },
  });

  if (!isSellerExist) {
    throw new ApiError(
      400,
      `seller is not exist you provide ${productData.sellerEmail}`
    );
  }

  // creating products
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
      auctionStartDate: productData.auctionStartDate,
      auctionEndDate: productData.auctionEndDate,
      brandId: productData.brandId,
      speed: productData.speed,
      price: productData.price,
      gear: productData.gear,
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
      sellerUserName: productData.sellerUserName,
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
        } else if (field === "status") {
          const normalizedStatus = normalizeStatus(normalizedSearchTerm);
          if (normalizedStatus) {
            return {
              status: normalizedStatus,
            };
          } else {
            return {};
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
            return {};
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
      }) as Prisma.ProductWhereInput[],
    });
  }

  // Always exclude deleted products
  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.ProductWhereInput = { AND: andConditions };

  // Fetch products with maximum bid price
  const result = await prisma.product.findMany({
    where: whereConditions,
    include: {
      brand: true,
    },
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  // Calculate maximum bid price for each product
  const productsWithMaxBid = await Promise.all(result.map(async (product) => {
    const maxBid = await prisma.bidding.aggregate({
      _max: {
        bidPrice: true,
      },
      where: {
        productId: product.id,
      },
    });

    return {
      ...product,
      maxBidPrice: maxBid._max.bidPrice || 0, // Default to 0 if no bids
    };
  }));

  const total = await prisma.product.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: productsWithMaxBid,
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
      auctionStartDate:
        payload.auctionStartDate ?? existingProduct?.auctionStartDate,
      auctionEndDate: payload.auctionEndDate ?? existingProduct?.auctionEndDate,
      brandId: payload.brandId ?? existingProduct?.brandId,
      speed: payload.speed ?? existingProduct?.speed,
      price: payload.price ?? existingProduct?.price,
      gear: payload.gear ?? existingProduct?.gear,
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
      sellerUserName: payload.sellerUserName ?? existingProduct?.sellerUserName,
      lotNumbers: payload.lotNumbers ?? existingProduct?.lotNumbers,
    },
  });

  return result;
};

const updateProductStatus = async (payload: any, id: string) => {
  const isProductExist = await prisma.product.findUniqueOrThrow({
    where: { id: id },
  });
  // Update the product with the provided payload
  const result = await prisma.product.update({
    where: { id: id },
    data: {
      ...payload,
    },
  });

  // Return the updated product or a success message
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
  const currentFeatured = await prisma.product.findFirstOrThrow({
    where: { featured: true },
  });

  return currentFeatured;
};

const getProductGroupings = async () => {
  // Fetch all products from the database with related brand data
  const products = await prisma.product.findMany({
    include: {
      brand: true,
    },
  });

  // Initialize grouping objects
  const regionGroup: Record<string, number> = {};
  const countryGroup: Record<string, number> = {};

  const brandGroup: Record<string, number> = {};

  // Group and count products by region, country, and brandName
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

  const brandList = Object.entries(brandGroup).map(
    ([brandName, count]) => `${brandName} (${count})`
  );

  // Return the formatted lists
  return {
    region: regionList,
    country: countryList,
    brand: brandList,
  };
};

// *! send email auction end highest bidder

const checkAuctionEnd = async () => {
  const now = new Date();

  // Find products where auctionEndDate is less than current date and status is 'live'
  const endedAuctions = await prisma.product.findMany({
    where: {
      auctionEndDate: { lte: now },
      status: "live",
    },
    include: {
      biddings: {
        orderBy: {
          bidPrice: "desc",
        },
        take: 1,
      },
      user: true,
    },
  });

  for (const auction of endedAuctions) {
    const highestBidder = auction.biddings[0];
    if (highestBidder && highestBidder.bidPrice >= auction.price) {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: highestBidder.userId,
        },
      });

      // Send email to the highest bidder
      await emailSender(
        `Congratulations! You've Won the Auction for ${auction?.productName}`,
        user?.email,
        `
        
        <!DOCTYPE html>
                  <html lang="en">

                  <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>Congratulations! You've Won the Auction</title>
                      <style>
                          body {
                              font-family: Arial, sans-serif;
                              background-color: #f4f4f4;
                              color: #333333;
                              margin: 0;
                              padding: 0;
                          }

                          .container {
                              width: 100%;
                              max-width: 600px;
                              margin: 0 auto;
                              background-color: #ffffff;
                              padding: 20px;
                              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                          }

                          .header {
                              text-align: center;
                              background-color: #4CAF50;
                              color: #ffffff;
                              padding: 20px 0;
                          }

                          .header h1 {
                              margin: 0;
                              font-size: 24px;
                          }

                          .content {
                              padding: 20px;
                          }

                          .content h2 {
                              color: #4CAF50;
                              font-size: 20px;
                          }

                          .content p {
                              font-size: 16px;
                              line-height: 1.6;
                              margin: 10px 0;
                          }

                          .content .product-details {
                              margin: 20px 0;
                              border: 1px solid #dddddd;
                              padding: 10px;
                              background-color: #f9f9f9;
                          }

                          .content .product-details h3 {
                              margin: 0;
                              font-size: 18px;
                          }

                          .content .product-details p {
                              margin: 5px 0;
                              font-size: 16px;
                          }

                          .footer {
                              text-align: center;
                              padding: 20px 0;
                              font-size: 14px;
                              color: #777777;
                          }

                          .footer p {
                              margin: 0;
                          }

                          .footer a {
                              color: #4CAF50;
                              text-decoration: none;
                          }
                      </style>
                  </head>

                  <body>
                      <div class="container">
                          <div class="header">
                              <h1>Congratulations, ${user?.firstName}</h1>
                          </div>
                          <div class="content">
                              <h2>You've Won the Auction!</h2>
                              <p>Dear ${user?.firstName},</p>
                              <p>We are thrilled to inform you that you have won the auction for the following product:</p>
                              <div class="product-details">
                                  <h3>Product Name: ${auction?.productName}</h3>
                                  <a href="http://localhost:3001/buy/${auction?.id}">See Your Win car</a></p>
                                  <p>Final Bid Amount: $${auction?.biddings[0]?.bidPrice}</p>
                                  <p>Auction End Date: ${auction?.auctionEndDate}</p>
                                   <img src="${auction.singleImage}" alt="${auction.productName}">
                              </div>
                              <p>Thank you for participating in the auction. We will be in touch with you shortly to finalize the purchase process.</p>
                              <p>If you have any questions or need further assistance, please feel free to contact us.</p>
                              <p>Best regards,</p>
                              <p>The Auction Team</p>
                          </div>
                          <div class="footer">
                              <p>© 2024 Auction House. All rights reserved.</p>
                              <p><a href="http://localhost:3001">Visit our website</a></p>
                          </div>
                      </div>
                  </body>

                  </html>

        
        `
      );

      // Update the product status to 'sold'
      await prisma.product.update({
        where: { id: auction.id },
        data: { status: "unsold" },
      });
    } else {
      // No bids placed, mark as unsold
      await prisma.product.update({
        where: { id: auction.id },
        data: { status: "unsold" },
      });
    }
  }
};

// Schedule the cron job to run every minute
export const scheduleAuctionCheck = () => {
  cron.schedule("* * * * *", checkAuctionEnd);
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
  updateProductStatus,
  checkAuctionEnd,
};
