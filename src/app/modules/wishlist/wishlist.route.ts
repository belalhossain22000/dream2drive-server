import express, { NextFunction, Request, Response } from "express";
import { wishlistController } from "./wishlist.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth("USER", "ADMIN"), wishlistController.toggleWishlist);
router.get("/", auth("USER", "ADMIN"), wishlistController.getWishlistByUser);
router.delete("/", auth("USER", "ADMIN"), wishlistController.deleteWishlist);
export const wishlistRoute = router;
