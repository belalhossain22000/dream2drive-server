// zodValidation/paymentValidation.ts
import { z } from "zod";


export const paymentValidationSchema = z.object({
  items: z.array(
    z.object({
      amount: z.number().positive(),
    })
  ),
});

export const validatePaymentRequest ={
 paymentValidationSchema
};