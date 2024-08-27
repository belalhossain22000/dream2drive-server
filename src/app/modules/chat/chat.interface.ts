// interfaces/chat.interface.ts

import { UserRole } from "@prisma/client";

export interface IChatroom {
  id: string;
  roomName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  id: string;
  chatroomId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatroomMember {
  id: string;
  chatroomId: string;
  userId: string;
  role: UserRole;
  joinedAt: Date;
}
