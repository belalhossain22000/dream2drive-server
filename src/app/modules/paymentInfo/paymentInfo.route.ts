import { Router } from "express";
import { paymentInfoController } from "./paymentInfo.controller";

const router = Router();

router.post("/", paymentInfoController.createPaymentInfo);
router.get("/", paymentInfoController.getPaymentInfo);
export const paymentInfoRoutes = router;
