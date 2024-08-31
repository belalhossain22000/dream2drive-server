import prisma from "../../../shared/prisma";
import { TBidding } from "./bidding.interface";

const createBiddingIntoDB = async (payload: TBidding) => {
  try {
    const result = await prisma.bidding.create({
      data: {
        bidPrice: payload.bidPrice,
        productId: payload.productId.toString(),
        userId: payload.userId.toString(),
      },
    });
    return result;
  } catch (error) {
    throw new Error(`Could not create Bidding: ${error}`);
  }
};

const getAllBiddingsIntoDB = async () => {
  try {
    const result = await prisma.bidding.findMany({
      include: {
        user: true,
        product: true,
      },
    });
    return result;
  } catch (error) {
    throw new Error(`Could not get Biddings: ${error}`);
  }
};
const getSingleProductBiddingsIntoDB = async (id: string) => {
  const result = await prisma.bidding.findMany({
    where: {
      productId: id,
    },
    include: {
      user: true,
      product: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getBiddingsByUser = async (userId: string) => {
  let win = 0,
    loss = 0,
    live = 0;
  let winProducts: any[] = [],
    lossProducts: any[] = [],
    liveProducts: any[] = [];

  // Get all user's highest bids for each product
  const bids = await prisma.bidding.findMany({
    where: {
      userId: userId,
    },
    include: {
      product: true,
    },
    orderBy: {
      bidPrice: "desc", // Order by highest bid first
    },
    distinct: ["productId"], // Ensure only the highest bid per product is retrieved
  });

  // Iterate over each bid and classify them
  for (const bid of bids) {
    const product = bid.product;

    const productInfo = {
      id: product.id,
      productName: product.productName,
      singleImage: product.singleImage,
      bidPrice: bid.bidPrice,
      status: product.status,
    };

    if (product.status === "unsold") {
      // Get the highest bid for this product (to determine if the user won)
      const highestBid = await prisma.bidding.findFirst({
        where: { productId: product.id },
        orderBy: { bidPrice: "desc" },
      });

      if (highestBid && highestBid.userId === bid.userId) {
        win++;
        winProducts.push(productInfo);
      } else {
        loss++;
        lossProducts.push(productInfo);
      }
    } else if (product.status === "live") {
      live++;
      liveProducts.push(productInfo);
    }
  }

  // Return the result with products
  return {
    win,
    loss,
    live,
    winProducts,
    lossProducts,
    liveProducts,
  };
};

export const BiddingServices = {
  createBiddingIntoDB,
  getAllBiddingsIntoDB,
  getSingleProductBiddingsIntoDB,
  getBiddingsByUser,
};
