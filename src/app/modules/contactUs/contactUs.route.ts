import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { contactUsSourcingController } from "./contactUs.controller";
import contactFormSchema from "./contactUs.validaton";

const router = express.Router();

router.post(
  "/",
  validateRequest(contactFormSchema),
  contactUsSourcingController.contactUsSourcingEmailSend
);

export const contactUsRoutes = router;
