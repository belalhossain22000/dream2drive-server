import express from "express";
import { productCotroller } from "./product.controller";
import { fileUploader } from "../../../helpars/fileUploader";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// task 3
router.post("/",auth("ADMIN","USER"), fileUploader.uploadMultiple, productCotroller.createProduct);
router.get("/", productCotroller.getAllProduct);
// router.get("/send-mail-winner", productCotroller.checkAuctionEnd);
router.get("/count-list", productCotroller.getProductGroupings);
router.get("/featured",auth(UserRole.ADMIN), productCotroller.getFeaturedProduct);
router.get("/:id", productCotroller.getSingleProduct);
router.put("/:id/status",auth(UserRole.ADMIN), productCotroller.updateProductStatus);
router.put("/:id",auth(UserRole.ADMIN), fileUploader.uploadMultiple, productCotroller.updateProduct);
router.put("/create-featured/:id",auth(UserRole.ADMIN), productCotroller.createFeaturedProduct);
router.delete("/:id",auth(UserRole.ADMIN), productCotroller.deleteProduct);

export const productRoutes = router;
