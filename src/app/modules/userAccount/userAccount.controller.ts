import { Request, Response, NextFunction } from "express";
import { paymentService } from "./userAccount.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import stripe from "../../../helpars/stripe";

// export const createSetupIntent = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const setupIntent = await paymentService.createSetupIntent();
//     res.json({ clientSecret: setupIntent.client_secret });
//   } catch (error) {
//     next(error);
//   }
// };

// export const validateCard = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { paymentMethodId } = req.body;
//     const paymentMethod = await paymentService.validateCard(paymentMethodId);
//     res.json(paymentMethod);
//   } catch (error) {
//     next(error);
//   }
// };

// const validateCards = async (req: Request, res: Response) => {
//   const cardDetails = req.body.card;

//   if (!cardDetails) {
//     return res.status(400).json({ error: "Card details are required" });
//   }

//   try {
//     const result = await paymentService.validateCard(cardDetails);

//     if (result.valid) {
//       return res.status(200).json({ valid: true });
//     } else {
//       return res.status(400).json({ valid: false, error: result.error });
//     }
//   } catch (error) {
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };
const validateCards = async (req: Request, res: Response) => {
  const { token } = req.body; // Token ID received from the frontend

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const paymentMethod = await stripe.paymentMethods.retrieve(token);

    // Check if the payment method is valid
    if (paymentMethod) {
      return res.status(200).json({ valid: true });
    } else {
      return res.status(400).json({ valid: false, error: 'Invalid token' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const paymentController = {
  // createSetupIntent,
  validateCards,
};
