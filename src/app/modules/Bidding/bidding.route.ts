import express from "express";
import { BiddingCotroller } from "./bidding.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();
// bidding
router.post("/",auth(UserRole.ADMIN,UserRole.USER), BiddingCotroller.createBidding);
router.get("/",auth(UserRole.ADMIN,UserRole.USER), BiddingCotroller.getAllBidding);
router.get("/user", auth(UserRole.ADMIN,UserRole.USER), BiddingCotroller.getBiddingByUser);
router.get("/:id", BiddingCotroller.getSingleBidding);

export const biddingRoutes = router;
