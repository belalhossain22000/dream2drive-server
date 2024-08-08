import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { vehicleInfovalidation } from "./vehicleInfo.validation";
import { VehicleInfoController } from "./vehicleInfo.controller";
import { fileUploader } from "../../../helpars/fileUploader";

const router = express.Router();

// task 3
router.post(
  "/",
  fileUploader.uploadSingle,
  VehicleInfoController.createVehicleInfo
);
router.get("/", VehicleInfoController.getAllVehicleInfos);

export const vehicleInfoRoutes = router;
