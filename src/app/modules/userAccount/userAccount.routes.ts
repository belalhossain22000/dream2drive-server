import { Router } from "express";
import { paymentController } from "./userAccount.controller";

const router = Router();

// router.post("/create-setup-intent", paymentController.createSetupIntent);
router.post("/validate-card", paymentController.validateCards);


export const userAccountRoutes = router;

