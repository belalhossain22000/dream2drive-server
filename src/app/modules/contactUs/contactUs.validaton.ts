import { z } from "zod";

const contactFormSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  phoneNumber: z.string().optional(),
  message: z.string().min(1),
});

export default contactFormSchema;
