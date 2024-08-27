import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { chatroomServices } from "./chatroom.services";
import { Request, Response } from "express";

const createChatRoom = catchAsync(async (req: Request, res: Response) => {
  const result = await chatroomServices.createChatroomIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " chatrooom created successfully",
    data: result,
  });
});
const getAllChatRoom = catchAsync(async (req: Request, res: Response) => {
  const result = await chatroomServices.getAllChatRoomFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " chatrooom created successfully",
    data: result,
  });
});
const getSingleChatRoom = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await chatroomServices.getChatRoomByIdIntoDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " chatrooom created successfully",
    data: result,
  });
});

export const chatroomController = {
  createChatRoom,
  getAllChatRoom,
  getSingleChatRoom,
};
