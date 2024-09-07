// services/chat.service.ts

import { PrismaClient, UserRole } from "@prisma/client";
import { IChatroom } from "./chat.interface";

const prisma = new PrismaClient();

const createChatroomIntoDB = async (payload: IChatroom) => {
  const result = await prisma.chatroom.create({
    data: {
      roomName: payload.roomName,
      productId:payload.productId,
      roomMembers: payload.roomMembers.map((member) => ({ id: member.id })),
    },
  });
  return result;
};

const getChatAllroomIntoDB = async () => {
  const result = await prisma.chatroom.findMany();
  return result;
};
const getChatroomByUserIdIntoDB = async (id: string) => {

  const chatrooms = await prisma.chatroom.findMany();
  
  const result = chatrooms.filter(chatroom =>
    chatroom.roomMembers && Array.isArray(chatroom.roomMembers) &&
    chatroom.roomMembers.some((member: any) => member.id === id)
  );
  
  return result;
};
const getSingleChatRoomIntoDB = async (id: string) => {
  
  const result = await prisma.chatroom.findUnique(
    {
      where:{
        id:id
      }
    }
  );
  
  
  return result;
};



const addMemberToChatroomIntoDB = async (
  chatroomId: string,
  userId: string,
  role: UserRole
) => {
  const result = await prisma.chatroomMember.create({
    data: {
      chatroomId,
      userId,
      role,
    },
  });
  return result;
};

const getChatroomMembersIntoDB = async (chatroomId: string) => {
  const result = await prisma.chatroomMember.findMany({
    where: { chatroomId },
  });
  return result;
};

const createMessageIntoDB = async (
  chatroomId: string,
  senderId: string,
  senderName: string,
  content: string
) => {
  const result = await prisma.message.create({
    data: {
      chatroomId,
      senderId,
      senderName,
      content,
    },
  });
  return result;
};

const getMessagesByChatroomIntoDB = async (chatroomId: string) => {
  const result = await prisma.message.findMany({
    where: { chatroomId: chatroomId },
    orderBy: { createdAt: "asc" },
  });
  return result;
};

export const chatServices = {
  createChatroomIntoDB,
  getChatroomByUserIdIntoDB,
  addMemberToChatroomIntoDB,
  getChatroomMembersIntoDB,
  createMessageIntoDB,
  getMessagesByChatroomIntoDB,
  getChatAllroomIntoDB,getSingleChatRoomIntoDB
};
