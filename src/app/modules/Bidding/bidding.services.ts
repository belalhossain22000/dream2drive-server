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
  try {
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
  } catch (error) {
    throw new Error(`Could not get Biddings: ${error}`);
  }
};

export const BiddingServices = {
  createBiddingIntoDB,
  getAllBiddingsIntoDB,
  getSingleProductBiddingsIntoDB,
};
