// src/services/orderService.ts
import { PrismaClient } from "@prisma/client";

import Stripe from "stripe";
import { CreatePaymentInput } from "./payment.interface";

const prisma = new PrismaClient();
const stripe = new Stripe(
  "sk_test_51NHR4gBqYS18nauIrwpoZU9ExZ1mOoAvO1m3ryInnprEoJTbpRvjQxilm2grE4LYNovH4hcjIumKFT7JXbko18Y800zgEYQ4wS"
);

const calculatePaymentAmount = (items: any): number => {
  let total = 0;
  items.forEach((item: any) => {
    total += item.amount;
  });
  return total;
};

export const createPaymentIntent = async (orderData: CreatePaymentInput) => {
  const { items } = orderData;
  const amount = calculatePaymentAmount(items);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "aud",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  // Optionally, save order data in the database
  const payment = await prisma.payment.create({
    data: {
      items: items as any,
      amount,
      currency: "aud",
    },
  });

  return paymentIntent.client_secret;
};
export const paymentService = {
  createPaymentIntent,
};
