import express, { NextFunction, Request, Response } from "express";
import { wishlistController } from "./wishlist.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/create-wishlist", wishlistController.createWishlist);
router.get("/get-wishlist",wishlistController.getWishlistByUser);

export const wishlistRoute = router;
