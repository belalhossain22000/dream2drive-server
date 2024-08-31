import express from "express";
import { productCotroller } from "./product.controller";
import { fileUploader } from "../../../helpars/fileUploader";
import auth from "../../middlewares/auth";

const router = express.Router();

// task 3
router.post("/",auth("ADMIN","USER"), fileUploader.uploadMultiple, productCotroller.createProduct);
router.get("/", productCotroller.getAllProduct);
// router.get("/send-mail-winner", productCotroller.checkAuctionEnd);
router.get("/count-list", productCotroller.getProductGroupings);
router.get("/featured", productCotroller.getFeaturedProduct);
router.get("/:id", productCotroller.getSingleProduct);
router.put("/:id/status", productCotroller.updateProductStatus);
router.put("/:id", fileUploader.uploadMultiple, productCotroller.updateProduct);
router.put("/create-featured/:id", productCotroller.createFeaturedProduct);
router.delete("/:id", productCotroller.deleteProduct);

export const productRoutes = router;
