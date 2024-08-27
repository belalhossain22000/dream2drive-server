export interface TMessage {
    id: string;
    chatroomId: string;
    senderId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }