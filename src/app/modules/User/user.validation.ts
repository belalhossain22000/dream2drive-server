import { z } from "zod";

const UserRoleEnum = z.enum(["ADMIN", "SELLER", "BUYER"]);
const UserStatusEnum = z.enum(["ACTIVE", "BLOCKED"]);

const CreateUserValidationSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(8),
  role: UserRoleEnum,
  userStatus: UserStatusEnum,
});

export const UserValidation = { CreateUserValidationSchema };
