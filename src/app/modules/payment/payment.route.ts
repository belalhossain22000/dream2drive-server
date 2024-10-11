import { Router } from "express";
import { paymentControllers } from "./payment.controller";



const router = Router();

router.post("/",paymentControllers.createPaymentIntentController);
router.put("/:id",paymentControllers.updatePaymentIntentController);



export const paymentRoutes = router;
