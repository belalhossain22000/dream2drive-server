import { z } from "zod";

const contactInfoSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  mobileNo: z.string(),
});

export const contactValidation = {
  contactInfoSchema,
};
