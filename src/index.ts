import { Server } from 'http';
import config from './config';
import { Server as SocketIOServer } from 'socket.io';
import app, { corsOptions } from './app/app';
async function main() {
    const server: Server =app.listen(config.port, () => {
        console.log("Sever is running on port ", config.port);
    });
    const io = new SocketIOServer(server, {
        cors: corsOptions
    });
    io.on('connection', (socket:any) => {
        console.log('A user connected:', socket.id);
    
        // Handle incoming messages
        socket.on('sendMessage', (data:any) => {
            console.log('Message received:', data);
            io.to(data.roomId).emit('receiveMessage', data);
        });
    
        // Join a room
        socket.on('joinRoom', (roomId:any) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`);
        });
    
        // Handle connection errors
        socket.on('connect_error', (err:any) => {
            console.error('Socket connection error:', err);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
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
