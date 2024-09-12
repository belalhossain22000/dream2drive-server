import express, { NextFunction, Request, Response } from "express";
import { wishlistController } from "./wishlist.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN,UserRole.USER), wishlistController.toggleWishlist);
router.get("/", auth(UserRole.ADMIN,UserRole.USER), wishlistController.getWishlistByUser);
router.delete("/", auth(UserRole.ADMIN,UserRole.USER), wishlistController.deleteWishlist);
export const wishlistRoute = router;
