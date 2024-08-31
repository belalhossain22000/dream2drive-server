import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { BiddingServices } from "./bidding.services";

const createBidding = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  const result = await BiddingServices.createBiddingIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bidding Created successfully!",
    data: result,
  });
});

const getAllBidding = catchAsync(async (req: Request, res: Response) => {
  const result = await BiddingServices.getAllBiddingsIntoDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Biddings retrieval successfully",
    data: result,
  });
});

// get all user bidding for showing biding card information
const getSingleBidding = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await BiddingServices.getSingleProductBiddingsIntoDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product bidding retrieval successfully",
    data: result,
  });
});
// get all user bidding for showing biding card information
const getBiddingByUser = catchAsync(async (req: Request, res: Response) => {
  const id = req?.user?.id;
  const result = await BiddingServices.getBiddingsByUser(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product bidding retrieval successfully",
    data: result,
  });
});


export const BiddingCotroller = {
  createBidding,
  getAllBidding,
  getSingleBidding,
  getBiddingByUser
};
