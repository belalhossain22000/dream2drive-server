import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { userController } from "./user.controller";

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
router.get("/", userController.getUsers);

export const userRoutes = router;
