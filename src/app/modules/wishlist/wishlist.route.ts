import express, { NextFunction, Request, Response } from "express";
import { wishlistController } from "./wishlist.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", wishlistController.createWishlist);
router.get("/:id", wishlistController.getWishlistByUser);
// router.get("/:id", wishlistController.getWishlistBySingleUser);
router.delete("/", wishlistController.deleteWishlist);
export const wishlistRoute = router;
