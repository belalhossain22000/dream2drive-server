import { Server } from 'http';
import config from './config';
import { Server as SocketIOServer } from 'socket.io';
import app, { corsOptions } from './app/app';
import { chatServices } from './app/modules/chat/chat.services';
async function main() {
    const server: Server =app.listen(config.port, () => {
        console.log("Sever is running on port ", config.port);
    });
    const io = new SocketIOServer(server, {
        cors: corsOptions
    });
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);
    
        socket.on("joinRoom", async (roomId) => {
          socket.join(roomId);
          console.log(`Socket ${socket.id} joined room ${roomId}`);
          const messages = await chatServices.getMessagesByChatroomIntoDB(roomId);
          socket.emit("loadMessages", messages);
        });
    
        socket.on("sendMessage", async (data) => {
          console.log("Message received:", data);
          const { chatroomId, senderId, content } = data;
          const message = await chatServices.createMessageIntoDB(chatroomId, senderId, content);
          io.to(chatroomId).emit("receiveMessage", message);
        });
    
        socket.on("disconnect", () => {
          console.log("User disconnected:", socket.id);
        });
    });
    const exitHandler = () => {
        if (server) {
            server.close(() => {
                console.info("Server closed!")
            })
        }
        process.exit(1);
    };
    process.on('uncaughtException', (error) => {
        console.log(error);
        exitHandler();
    });

    process.on('unhandledRejection', (error) => {
        console.log(error);
        exitHandler();
    })
};

main();
