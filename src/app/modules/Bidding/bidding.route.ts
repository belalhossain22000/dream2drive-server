import express from "express";
import { BiddingCotroller } from "./bidding.controller";
import auth from "../../middlewares/auth";

const router = express.Router();
// bidding
router.post("/", BiddingCotroller.createBidding);
router.get("/", auth("USER", "ADMIN"), BiddingCotroller.getBiddingByUser);
router.get("/:id", BiddingCotroller.getSingleBidding);
router.get("/", BiddingCotroller.getAllBidding);

export const biddingRoutes = router;
