// src/services/orderService.ts
import { PrismaClient } from "@prisma/client";

import Stripe from "stripe";
import { CreatePaymentInput } from "./payment.interface";
import config from "../../../config";
import prisma from "../../../shared/prisma";


const stripe = new Stripe(config.stripe_key as string);
export const createPaymentIntent = async (paymentData: CreatePaymentInput) => {
  const { price } = paymentData;
  const myPrice=price*100;
  const amount = myPrice;

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "aud",
    payment_method_types:['card']
  });

  // Optionally, save order data in the database
  const payment = await prisma.payment.create({
    data: {
      amount,
      currency: "aud",
    },
  });

  return paymentIntent.client_secret;
};
export const paymentService = {
  createPaymentIntent,
};
