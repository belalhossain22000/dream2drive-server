import express from "express";
import validateRequest from "../../middlewares/validateRequest";
// import { vehicleInfovalidation } from "./vehicleInfo.validation";
import { VehicleInfoController } from "./vehicleInfo.controller";
import { fileUploader } from "../../../helpars/fileUploader";

const router = express.Router();

// *? create vehicle
router.post(
  "/",
  fileUploader.uploadSingle,
  VehicleInfoController.createVehicleInfo
);

// *? get vehicle
router.get("/", VehicleInfoController.getAllVehicleInfos);
router.delete("/:id", VehicleInfoController.deleteVehicle);

export const vehicleInfoRoutes = router;
