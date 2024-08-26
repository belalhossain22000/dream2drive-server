import { Router } from "express";
import { paymentControllers } from "./payment.controller";



const router = Router();

router.post("/",paymentControllers.createPaymentIntentController);


export const paymentRoutes = router;
