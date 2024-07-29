import { Request, Response, NextFunction } from "express";
import { paymentService } from "./userAccount.service";

export const createSetupIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const setupIntent = await paymentService.createSetupIntent();
    res.json({ clientSecret: setupIntent.client_secret });
  } catch (error) {
    next(error);
  }
};

export const validateCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentMethodId } = req.body;
    const paymentMethod = await paymentService.validateCard(paymentMethodId);
    res.json(paymentMethod);
  } catch (error) {
    next(error);
  }
};

export const paymentController = {
  createSetupIntent,
  validateCard,
};
