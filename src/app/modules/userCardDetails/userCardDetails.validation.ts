import { z } from "zod";

// Zod schema for UserCardDetails
export const userCardDetailsSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"), // assuming ObjectId format
  cardNumber: z.string().length(16, "Card number must be 16 digits"),
  month: z
    .string()
    .regex(/^(0[1-9]|1[0-2])$/, "Month must be between 01 and 12"),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
  cvc: z.string().length(3, "CVC must be 3 digits"),
  zip: z.string().min(5, "ZIP code must be at least 5 digits"),
});
