import { z } from "zod";

const UserRoleEnum = z.enum(["ADMIN", "SELLER", "BUYER"]);
const UserStatusEnum = z.enum(["ACTIVE", "BLOCKED"]);

const CreateUserValidationSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  username: z.string().min(1),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .nonempty("Password is required"),
});

const UserLoginValidationSchema = z.object({
  email: z.string().email().nonempty("Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .nonempty("Password is required"),
});

export const UserValidation = {
  CreateUserValidationSchema,
  UserLoginValidationSchema,
};
