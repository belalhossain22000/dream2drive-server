// controllers/chat.controller.ts

import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { chatServices } from "./chat.services";
import sendResponse from "../../../shared/sendResponse";

const createChatroom = catchAsync(async (req: Request, res: Response) => {
  const { roomName } = req.body;
  console.log(roomName);
  const result = await chatServices.createChatroomIntoDB(roomName);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Chatroom created successfully",
    data: result,
  });
});
const getChatroom = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.params;
  const result = await chatServices.createChatroomIntoDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Chatroom retrived successfully",
    data: result,
  });
});

const addMember = catchAsync(async (req: Request, res: Response) => {
  const { chatroomId, userId, role } = req.body;
  const result = await chatServices.addMemberToChatroomIntoDB(
    chatroomId,
    userId,
    role
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Member added to chatroom successfully",
    data: result,
  });
});

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const { chatroomId, senderId, content } = req.body;
  const result = await chatServices.createMessageIntoDB(
    chatroomId,
    senderId,
    content
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Message sent successfully",
    data: result,
  });
});

const getMessages = catchAsync(async (req: Request, res: Response) => {
  const { chatroomId } = req.params;
  const result = await chatServices.getMessagesByChatroomIntoDB(chatroomId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Messages retrieved successfully",
    data: result,
  });
});

const getMembers = catchAsync(async (req: Request, res: Response) => {
  const { chatroomId } = req.params;
  const result = await chatServices.getChatroomMembersIntoDB(chatroomId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Chatroom members retrieved successfully",
    data: result,
  });
});

export const chatController = {
  createChatroom,
  addMember,
  sendMessage,
  getMessages,
  getMembers,
  getChatroom,
};
