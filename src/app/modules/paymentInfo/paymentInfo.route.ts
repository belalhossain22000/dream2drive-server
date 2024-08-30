import { Router } from "express";
import { paymentInfoController } from "./paymentInfo.controller";

const router = Router();

router.post("/", paymentInfoController.createPaymentInfo);
router.get("/", paymentInfoController.getPaymentInfo);
router.get("/:id", paymentInfoController.getPaymentInfoByUserId);
export const paymentInfoRoutes = router;
