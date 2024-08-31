import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { vehicleSourcingController } from "./vehicleSourcing.controller";

const router = express.Router();

router.post(
  "/",
  vehicleSourcingController.vehicleSourcingEmailSend
);


export const vehicleSourcingRoutes = router;
