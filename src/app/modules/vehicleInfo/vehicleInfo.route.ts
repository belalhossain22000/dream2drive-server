import express from "express";
import validateRequest from "../../middlewares/validateRequest";
// import { vehicleInfovalidation } from "./vehicleInfo.validation";
import { VehicleInfoController } from "./vehicleInfo.controller";
import { fileUploader } from "../../../helpars/fileUploader";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// *? create vehicle
router.post(
  "/",
  fileUploader.uploadSingle,
  VehicleInfoController.createVehicleInfo
);

// *? get vehicle
router.get("/", VehicleInfoController.getAllVehicleInfos);
router.delete("/:id",auth(UserRole.ADMIN), VehicleInfoController.deleteVehicle);

export const vehicleInfoRoutes = router;
