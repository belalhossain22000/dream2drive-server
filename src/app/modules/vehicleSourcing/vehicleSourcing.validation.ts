import { z } from "zod";

export const vehicleSourcingSchema = z.object({
  phoneCode: z.string().nonempty("Phone code is required"),
  phone: z.string().nonempty("Phone number is required"),
  model: z.string().nonempty("Vehicle model is required"),
  email: z.string().email("Invalid email address").optional(),
  manufacturer: z.string().nonempty("Manufacturer is required"),
  preferredYear: z.string().optional(),
  maximumBudget: z.string().nonempty("Maximum budget is required"),
  message: z.string().optional(),
  currency: z.string().nonempty("Currency is required"),
});
