import express from "express";

import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { AuthController } from "./auth.controller";
import { UserValidation } from "../User/user.validation";

const router = express.Router();

router.post(
  "/login",
  validateRequest(UserValidation.UserLoginValidationSchema),
  AuthController.loginUser
);

export const AuthRoutes = router;
