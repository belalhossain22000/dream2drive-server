import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { TPaymentInfo } from "./paymentInfo.interface";

const createpaymentInfoIntoDB = async (payload: TPaymentInfo) => {
  // Create the paymentInfo in the database
  const result = await prisma.paymentInfo.create({
    data: {
      clientId: payload.clientId,
      transactionId: payload.transactionId,
      carsId: payload.carsId,
      amount: payload.amount,
    }, 
  });

  return result;
};

const getpaymentInfoIntoDB = async () => {
  const paymentInfos = await prisma.paymentInfo.findMany({
    include: {
      user: true, 
      product: true,
    },
  });

  return paymentInfos;
};


export const paymentInfoService = {
    getpaymentInfoIntoDB,createpaymentInfoIntoDB
};
