import prisma from "../../../shared/prisma";

const createMessage = async (chatroomId: string, senderId: string, content: string) => {
    const result = await prisma.message.create({
      data: {
        chatroomId,
        senderId,
        content,
      },
    });
    return result;
  };
  
  const getMessagesByChatroom = async (chatroomId: string) => {
    const result = await prisma.message.findMany({
      where: { chatroomId },
      orderBy: { createdAt: "asc" },
    });
    return result;
  };
  export const messageServices={
    createMessage,getMessagesByChatroom
  }