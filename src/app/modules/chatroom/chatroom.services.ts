import prisma from "../../../shared/prisma";
import { Chatroom } from "./chatroom.interface";

const createChatroomIntoDB = async (payload: any): Promise<Chatroom> => {
  const chatroom = await prisma.chatroom.create({
    data: {
      roomName: payload.roomName,
    },
  });
  return chatroom;
};

const getChatRoomByIdIntoDB  = async (id: string) => {
  const result = prisma.chatroom.findUnique({
    where: {
      id: id,
    },
  });
  return result;
};
const getAllChatRoomFromDB  = async () => {
  const result = prisma.chatroom.findMany();
  return result;
};
export const chatroomServices = {
  createChatroomIntoDB,
  getChatRoomByIdIntoDB,
  getAllChatRoomFromDB,
};
