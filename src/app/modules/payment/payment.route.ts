import { Router } from "express";
import { paymentControllers } from "./payment.controller";



const router = Router();

router.post("/",paymentControllers.createPaymentIntentController);
router.get("/",paymentControllers.getAllPayment);
router.put("/:id",paymentControllers.updatePaymentIntentController);
router.delete("/:id",paymentControllers.deletePayment);



export const paymentRoutes = router;
