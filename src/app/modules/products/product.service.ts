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
import { CalculateThePrice } from "../../../helpars/priceCalculate";
import stripe from "../../../helpars/stripe";
import { chatServices } from "../chat/chat.services";
import { userService } from "../User/user.services";
import { paymentService } from "../payment/payment.services";

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
      ...filesData,
      ...productData,
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
    include: {},
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
  const productsWithMaxBid = await Promise.all(
    result.map(async (product) => {
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
    })
  );

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
    include: {},
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
    if (!auction?.price) {
      throw new ApiError(httpStatus.NOT_FOUND, "Auction Price not found ");
    }

    const highestBidder = auction.biddings[0];
    if (highestBidder && highestBidder?.bidPrice >= auction?.price) {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: highestBidder.userId,
        },
      });

      const paymentDetails = await prisma.payment.findFirst({
        where: {
          userId: user.id,
          paymentStatus: "PENDING",
        },
      });

      if (
        !paymentDetails ||
        !paymentDetails.paymentIntentId ||
        !paymentDetails.paymentMethodId
      ) {
        throw new Error("Payment details or payment intent ID not found.");
      }

      // Calculate the amount to be paid
      const payToDreamToDrive = await CalculateThePrice(highestBidder.bidPrice);
      const paymentAmountInCents = Math.round(payToDreamToDrive * 100);
      try {
        // Update the payment intent with the new amount if necessary
        const updateAmount = await stripe.paymentIntents.update(
          paymentDetails.paymentIntentId,
          {
            amount: paymentAmountInCents,
          }
        );
        // Confirm the payment on Stripe using the payment method
        const paymentConfirmation = await stripe.paymentIntents.confirm(
          paymentDetails.paymentIntentId,
          {
            payment_method: paymentDetails.paymentMethodId,
          }
        );

        if (paymentConfirmation.status === "succeeded") {
          // Update the payment record to mark it as paid
          await prisma.payment.update({
            where: {
              id: paymentDetails.id,
              paymentStatus: "PENDING",
            },
            data: {
              amount: payToDreamToDrive,
              paymentStatus: "PAID",
            },
          });
          await paymentService.deletePaymentDataFromDB(paymentDetails.id);
          const transactionId = paymentDetails.paymentIntentId; // Use the paymentIntentId as transaction ID
          const paymentAmount = payToDreamToDrive;
          // Send email to the highest bidder
          await emailSender(
            `Congratulations! You've Won the Auction for ${auction?.productName}`,
            user?.email,
            `<html>
              <p>Dear ${user?.email},</p>
              <p>Congratulations! You've won the auction for ${auction?.productName}.</p>
              <p>Your payment has been completed successfully.</p>
              <p><strong>Transaction ID:</strong> ${transactionId}</p>
              <p><strong>Payment Amount:</strong> $${paymentAmount}</p>
              <p>Thank you for your purchase!</p>
            </html>` // Simplified email content
          );
          // Update the product status to 'sold'
          await prisma.product.update({
            where: { id: auction.id },
            data: { status: "sold" },
          });
          const getSeller = userService.getUserByEmailFromDb(
            auction?.sellerEmail as string
          );
          const getAdmin = await userService.getAdminFromDB();
          const payload = {
            roomName: auction.productName,
            productId: auction.id,
            roomMembers: [
              { id: (await getSeller).id },
              { id: user.id },
              ...getAdmin.map((admin) => ({ id: admin.id })),
            ],
          };

          const createChat = await chatServices.createChatroomIntoDB(
            payload as any
          );
        } else {
        }
      } catch (error) {
        await prisma.product.update({
          where: { id: auction.id },
          data: { status: "unsold" },
        });
        // Optionally update the payment status to 'FAILED' in your database
        await prisma.payment.update({
          where: {
            id: paymentDetails.id,
          },
          data: {
            paymentStatus: "FAILED",
          },
        });
      }
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
