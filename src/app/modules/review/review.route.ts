import { Router } from "express";
import { reviewController } from "./review.controller";


const router = Router();

router.post("/create-review", reviewController.createReview);
router.get("/get-review", reviewController.getReview);

export const reviewRoutes = router;
