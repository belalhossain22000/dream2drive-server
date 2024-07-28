import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { userController } from "./user.controller";

const router = express.Router();

router.post(
  "/create-user",
  validateRequest(UserValidation.CreateUserValidationSchema),
  userController.createUser
);
router.post(
  "/create-admin",
  validateRequest(UserValidation.CreateUserValidationSchema),
  userController.createAdmin
);
router.get("/users", userController.getUsers);

export const userRoutes = router;
