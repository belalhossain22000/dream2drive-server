import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { brandValidation } from "./brands.validation";
import { brandController } from "./brands.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// crate a brands
router.post(
  "/",auth(UserRole.ADMIN),
  validateRequest(brandValidation.BrandValidationSchema),
  brandController.createBrand
);

// get all brands
router.get("/",auth(UserRole.ADMIN,UserRole.USER), brandController.getAllBrands);
// update brand
router.put("/:id",auth(UserRole.ADMIN), brandController.updateBrand);
// delete brand
router.delete("/:id",auth(UserRole.ADMIN), brandController.deleteBrand);

export const brandRoutes = router;
