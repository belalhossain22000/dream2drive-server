import { Router } from "express";
import { paymentController } from "./userAccount.controller";

const router = Router();

router.post("/validate-card", paymentController.validateCards);
router.post("/create-bank-details", paymentController.createUserBankAccount);
router.get("/get-bank-details", paymentController.getAllUserBankAccount);

export const userAccountRoutes = router;
