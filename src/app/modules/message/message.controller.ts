// controllers/message.controller.ts

import { Socket } from "socket.io";
import { Server as SocketIOServer } from "socket.io";
import { saveAndEmitMessage } from "./message.services";
import { TMessage } from "./message.interface";


export const handleSendMessage = (io: SocketIOServer, socket: Socket) => {
  socket.on("sendMessage", async (data: TMessage) => {
    await saveAndEmitMessage(io, data);
  });
};
export const messageController={
    
}