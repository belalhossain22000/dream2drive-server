// services/chatroomMember.service.ts
import { PrismaClient } from '@prisma/client';
import { TChatroomMember } from './chatRoomMember.interface';
import prisma from '../../../shared/prisma';

const addMemberToChatroom = async (payload: TChatroomMember) => {
  const member = await prisma.chatroomMember.create({
    data: {
      chatroomId: payload.chatroomId,
      userId: payload.userId,
      role: payload.role,
    },
  });

  return member;
};

const getUserChatrooms = async (userId: string) => {
  // Fetch all chatrooms and filter them in the application code
  const chatrooms = await prisma.chatroom.findMany({
    include: {
      members: true,
      messages: true,
    },
  });

  // Filter chatrooms where the user is a member
  const userChatrooms = chatrooms.filter(chatroom =>
    chatroom.members.some(member => member.userId === userId)
  );

  return userChatrooms;
};

const getAllChatroomsForAdmin = async () => {
  const chatrooms = await prisma.chatroom.findMany({
    include: {
      members: true,
      messages: true,
    },
  });

  return chatrooms;
};

export { addMemberToChatroom, getUserChatrooms, getAllChatroomsForAdmin };
