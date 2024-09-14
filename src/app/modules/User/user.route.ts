import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/",
  validateRequest(UserValidation.CreateUserValidationSchema),
  userController.createUser
);
router.post(
  "/create-admin",
  validateRequest(UserValidation.CreateUserValidationSchema),
  userController.createAdmin
);
router.get("/", auth(UserRole.ADMIN), userController.getUsers);
router.get("/:id",auth(UserRole.ADMIN), userController.getUsersById);
router.put(
  "/profile",
  validateRequest(UserValidation.userUpdateSchema),
  auth(UserRole.ADMIN, UserRole.USER),
  userController.updateProfile
);
router.put(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(UserValidation.userUpdateSchema),
  userController.updateUser
);

export const userRoutes = router;
