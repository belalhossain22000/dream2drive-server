import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { articleServices } from "./article.services";



const createArticle = catchAsync(async (req: Request, res: Response) => {
  const result = await articleServices.createArticleIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Article created successfully!",
    data: result,
  });
});

const getAllArticles = catchAsync(async (req: Request, res: Response) => {
  const result = await articleServices.getAllArticlesFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Articles retrieved successfully",
    data: result,
  });
});

export const ArticleController = {
  createArticle,
  getAllArticles,
};
