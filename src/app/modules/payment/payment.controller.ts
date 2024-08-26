// src/controllers/orderController.ts
import { Request, Response } from "express";
import { createPaymentIntent } from "./payment.services";

export const createPaymentIntentController = async (
  req: Request,
  res: Response
) => {
  try {
    const clientSecret = await createPaymentIntent(req.body);
    res.send({ clientSecret });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to create payment intent" });
  }
};
export const paymentControllers = {
  createPaymentIntentController,
};
