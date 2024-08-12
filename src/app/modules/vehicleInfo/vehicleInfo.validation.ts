import { z } from "zod";
const VehicleInfoSchema = z.object({
  firstName: z.string(),
  lastName: z.string().optional(),
  email: z.string(),
  mobileNo: z.string(),
  carMake: z.string().min(1, "Car make is required"),
  carDetails: z.string().min(1, "Car details are required"),
  contactId: z.string().optional(),
  carImage: z.string().optional(),
  aboutHear: z.string().min(1, "About hear information is required"),
});
export const vehicleInfovalidation = {
  VehicleInfoSchema,
};
