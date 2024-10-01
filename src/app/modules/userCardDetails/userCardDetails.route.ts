import express from "express";
import { UserCardDetailsController } from "./userCardDetails.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userCardDetailsSchema } from "./userCardDetails.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", UserCardDetailsController.getUserCardDetails);

router.get(
  "/:id",
  UserCardDetailsController.getUserCardDetailsByUserId
);

router.post(
  "/",
  validateRequest(userCardDetailsSchema),
  UserCardDetailsController.createUserCardDetails
);
export const userCardDetailsRouter = router;
