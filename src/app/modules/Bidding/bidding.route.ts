import express from "express";
import { BiddingCotroller } from "./bidding.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();
// bidding
router.post("/",auth(UserRole.ADMIN,UserRole.USER), BiddingCotroller.createBidding);
router.get("/", BiddingCotroller.getAllBidding);
router.get("/user",  BiddingCotroller.getBiddingByUser);
router.get("/:id", BiddingCotroller.getSingleBidding);

export const biddingRoutes = router;
