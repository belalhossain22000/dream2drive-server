// services/message.service.ts
import prisma from "../../../shared/prisma"; // Adjust the path as needed
import { Server as SocketIOServer } from "socket.io";
import { TMessage } from "./message.interface";

export const saveAndEmitMessage = async (
  io: SocketIOServer,
  message: TMessage
) => {
  try {
    // Save message to the database using Prisma
    await prisma.message.create({
      data: {
        chatroomId: message.roomId,
        senderId: message.senderId,
        content: message.content,
      },
    });

    // Emit message to other users in the room
    io.to(message.roomId).emit("newMessage", {
      senderId: message.senderId,
      content: message.content,
    });
  } catch (err) {
    console.error("Error saving message:", err);
  }
};
