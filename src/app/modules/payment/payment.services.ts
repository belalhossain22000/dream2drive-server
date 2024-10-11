// src/services/orderService.ts
import { PrismaClient } from "@prisma/client";

import Stripe from "stripe";
import { CreatePaymentInput } from "./payment.interface";
import config from "../../../config";
import prisma from "../../../shared/prisma";

const stripe = new Stripe(config.stripe_key as string);
export const createPaymentIntent = async (paymentData: CreatePaymentInput) => {
  const { price } = paymentData;

  // Set a default price if no price is provided initially (e.g., 1 AUD cent)
  const myPrice = price ? Number(price) : 1;

  // Convert to cents
  const amount = Math.round(myPrice * 100); // Ensure amount is an integer

  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Invalid amount value.");
  }

  // Create the payment intent with the placeholder amount
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "aud",
    payment_method_types: ["card"],
  });

  // Optionally, save order data in the database
  const payment = await prisma.payment.create({
    include: {
      user: true,
    },
    data: {
      currency: "aud",
      paymentMethodId: paymentData.paymentMethodId,
      userId: paymentData.userId,
      paymentStatus: "PENDING",
      amount: amount / 100,
      paymentIntentId: paymentIntent.id,
    },
  });

  return paymentIntent.client_secret;
};
const updatePaymentIntent = async (
  id: string, // Payment record ID from your database
  payload: any
) => {
  // Retrieve the payment record from the database to get the paymentIntentId
  const payment = await prisma.payment.findUnique({
    where: { id },
  });

  if (!payment || !payment.paymentIntentId) {
    throw new Error("Payment record not found or missing payment intent ID.");
  }

  const paymentIntentId = payment.paymentIntentId;
  const newAmount = Math.round(payload.price * 100);

  if (!Number.isInteger(newAmount) || newAmount <= 0) {
    throw new Error("Invalid amount value.");
  }

  // Update the existing payment intent with the new amount
  const updatedPaymentIntent = await stripe.paymentIntents.update(
    paymentIntentId,
    {
      amount: newAmount,
    }
  );

  // Update the stored payment record if necessary
  const existingPaymentRecord = await prisma.payment.findUnique({
    where: { id },
  });
  await prisma.payment.update({
    where: { id },
    data: {
      amount: newAmount ?? existingPaymentRecord?.amount,
      currency: payload.currency ?? existingPaymentRecord?.currency,
      paymentMethodId:
        payload.paymentMethodId ?? existingPaymentRecord?.paymentMethodId,
      userId: payload.userId ?? existingPaymentRecord?.userId,
      paymentStatus:
        payload.paymentStatus ?? existingPaymentRecord?.paymentStatus,
    },
  });

  return updatedPaymentIntent;
};

export const paymentService = {
  createPaymentIntent,
  updatePaymentIntent,
};
