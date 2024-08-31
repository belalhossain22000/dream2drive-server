import { z } from "zod";

export const BrandValidationSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
});

export const brandValidation = {
  BrandValidationSchema,
};
