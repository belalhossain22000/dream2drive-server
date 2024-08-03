import { z } from "zod";

export const BrandValidationSchema = z.object({
  brandName: z.string(),
});

export const brandValidation = {
  BrandValidationSchema,
};
