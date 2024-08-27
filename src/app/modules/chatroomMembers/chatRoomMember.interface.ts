// interfaces/chatroomMember.interface.ts
export interface TChatroomMember {
    chatroomId: string;
    userId: string;
    role: 'ADMIN' | 'USER';
  }
  