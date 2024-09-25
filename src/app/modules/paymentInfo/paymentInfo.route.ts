import { Router } from "express";
import { paymentInfoController } from "./paymentInfo.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/", paymentInfoController.createPaymentInfo);
router.get("/",auth(UserRole.ADMIN,UserRole.USER), paymentInfoController.getPaymentInfo);
router.get("/:id",auth(UserRole.ADMIN,UserRole.USER), paymentInfoController.getPaymentInfoByUserId);
export const paymentInfoRoutes = router;
