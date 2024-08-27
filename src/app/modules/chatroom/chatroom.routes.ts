import { Router } from "express";
const router = Router();
import { chatroomController } from "./chatroom.controller";
router.post("/", chatroomController.createChatRoom);
router.get("/", chatroomController.getAllChatRoom);
router.get("/:id", chatroomController.getSingleChatRoom);
export const chatrooomRoutes = router;
