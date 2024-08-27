// services/chat.service.ts

import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const createChatroomIntoDB = async (roomName: string) => {
  const result = await prisma.chatroom.create({
    data: {
      roomName,
    },
  });
  return result;
};

const getChatroomByIdIntoDB = async (id: string) => {
  
  const result = await prisma.chatroom.findUnique({
    where: { id:id },
  });
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
  content: string
) => {
  const result = await prisma.message.create({
    data: {
      chatroomId,
      senderId,
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
  getChatroomByIdIntoDB,
  addMemberToChatroomIntoDB,
  getChatroomMembersIntoDB,
  createMessageIntoDB,
  getMessagesByChatroomIntoDB,
};
