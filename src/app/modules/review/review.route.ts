import { Router } from "express";
import { reviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";


const router = Router();

router.post("/",auth(UserRole.ADMIN,UserRole.USER), reviewController.createReview);
router.get("/",auth(UserRole.ADMIN,UserRole.USER), reviewController.getReview);
router.get("/:id",auth(UserRole.ADMIN,UserRole.USER), reviewController.getSingleReview);

export const reviewRoutes = router;
