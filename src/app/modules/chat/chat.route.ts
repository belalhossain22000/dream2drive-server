// routes/chat.route.ts

import { Router } from "express";
import { chatController } from "./chat.controller";

const router = Router();

router.post("/", chatController.createChatroom); // Create a new chatroom
router.post("/:id", chatController.createChatroom); // Create a new chatroom
router.post("/member", chatController.addMember); // Add a member to a chatroom
router.post("/message", chatController.sendMessage); // Send a message
router.get("/:chatroomId/messages", chatController.getMessages); // Get all messages for a chatroom
router.get("/:chatroomId/members", chatController.getMessages); // Get all members of a chatroom

export const chatRoutes = router;