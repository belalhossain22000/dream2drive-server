import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { TPaymentInfo } from "./paymentInfo.interface";

const createpaymentInfoIntoDB = async (payload: TPaymentInfo) => {
  
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
      product:true, 
    },
  });

  
  const paymentInfosWithSeller = await Promise.all(
    paymentInfos.map(async (paymentInfo) => {
      const sellerEmail = paymentInfo.product.sellerEmail; 

      if (sellerEmail) {
       
        const seller = await prisma.user.findUnique({
          where: { email: sellerEmail },
          select: {
            id:true, 
            username:true,
          },
        });

        
        return {
          ...paymentInfo,
          seller,
        };
      } else {
      
        return paymentInfo;
      }
    })
  );

  return paymentInfosWithSeller;
};

const getpaymentInfoByUserIntoDB = async (id:string) => {
  const paymentInfos = await prisma.paymentInfo.findMany({
    where:{
      clientId:id
    },
    include: {
      user: true, 
      product: true,
    },
  });

  return paymentInfos;
};


export const paymentInfoService = {
    getpaymentInfoIntoDB,createpaymentInfoIntoDB,getpaymentInfoByUserIntoDB
};
