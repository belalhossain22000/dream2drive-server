// routes/chat.route.ts

import { Router } from "express";
import { chatController } from "./chat.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/",auth(UserRole.ADMIN,UserRole.USER), chatController.createChatroom); // Create a new chatroom
router.get("/",auth(UserRole.ADMIN,UserRole.USER), chatController.getAllChatrooms); // Create a new chatroom
router.get("/:id",auth(UserRole.ADMIN,UserRole.USER), chatController.getChatroom); // Create a new chatroom
router.get("/singleRoom/:id",auth(UserRole.ADMIN,UserRole.USER), chatController.getSingleChatRoom); // Create a new chatroom
router.post("/:id",auth(UserRole.ADMIN,UserRole.USER), chatController.createChatroom); // Create a new chatroom
router.post("/member",auth(UserRole.ADMIN,UserRole.USER), chatController.addMember); // Add a member to a chatroom
router.post("/message",auth(UserRole.ADMIN,UserRole.USER), chatController.sendMessage); // Send a message
router.get("/:chatroomId/messages",auth(UserRole.ADMIN,UserRole.USER), chatController.getMessages); // Get all messages for a chatroom
router.get("/:chatroomId/members",auth(UserRole.ADMIN,UserRole.USER), chatController.getMessages); // Get all members of a chatroom

export const chatRoutes = router;
