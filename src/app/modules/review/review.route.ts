import { Router } from "express";
import { reviewController } from "./review.controller";
import auth from "../../middlewares/auth";


const router = Router();

router.post("/",auth("USER"), reviewController.createReview);
router.get("/",auth("USER", "ADMIN"), reviewController.getReview);
router.get("/:id",auth("USER", "ADMIN"), reviewController.getSingleReview);

export const reviewRoutes = router;
