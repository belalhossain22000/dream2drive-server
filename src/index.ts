import { Server } from "http";
import config from "./config";
import { Server as SocketIOServer } from "socket.io";
import app, { corsOptions } from "./app/app";
import { chatServices } from "./app/modules/chat/chat.services";
async function main() {
  const server: Server = app.listen(config.port, () => {
    console.log("Sever is running on port ", config.port);
  });
  const io = new SocketIOServer(server, {
    cors: corsOptions,
  });
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinRoom", async (roomId) => {
      try {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
        const messages = await chatServices.getMessagesByChatroomIntoDB(roomId);
        socket.emit("loadMessages", messages);
      } catch (error) {
        console.error(`Error joining room ${roomId}:`, error);
      }
    });
    

    socket.on("sendMessage", async (data) => {
   
      const { chatroomId, senderId,senderName, content } = data;
      const message = await chatServices.createMessageIntoDB(
        chatroomId,
        senderId,
        senderName,
        content
      );
      io.to(chatroomId).emit("receiveMessage", message);
    });

    // Handle the "typing" event
    socket.on("typing", (data) => {
      const { chatroomId, username } = data;
  
      // Broadcast the typing status to everyone in the room except the sender
      socket.to(chatroomId).emit("typing", { username });
    });
  

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
  const exitHandler = () => {
    if (server) {
      server.close(() => {
       
      });
    }
    process.exit(1);
  };
  process.on("uncaughtException", (error) => {
  
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
  
    exitHandler();
  });
}

main();
