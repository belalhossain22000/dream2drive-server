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
router.get(
  "/users",
  // validateRequest(UserValidation.CreateUserValidationSchema),
  userController.getUsers
);

export const userRoutes = router;
