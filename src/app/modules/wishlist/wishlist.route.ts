import express, { NextFunction, Request, Response } from "express";
import { wishlistController } from "./wishlist.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth("USER"), wishlistController.toggleWishlist);
router.get("/",  wishlistController.getWishlistByUser);
router.get("/:id", wishlistController.getWishlistByProduct);
router.delete("/", auth("USER"), wishlistController.deleteWishlist);
export const wishlistRoute = router;
