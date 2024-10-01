import express from "express";
import { UserCardDetailsController } from "./userCardDetails.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userCardDetailsSchema } from "./userCardDetails.validation";

const router = express.Router();
router.get("/", UserCardDetailsController.getUserCardDetails);

router.post(
  "/",
  validateRequest(userCardDetailsSchema),
  UserCardDetailsController.createUserCardDetails
);
export const userCardDetailsRouter = router;
