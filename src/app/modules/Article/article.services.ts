import httpStatus from "http-status";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErrors";
import { TArticle } from "./article.interface";

const createArticleIntoDB = async (payload: TArticle) => {
    try {

        const result = await prisma.article.create({
            data: {
                bannerImage: payload.bannerImage,
                articleTitle: payload.articleTitle,
                published_by: payload.published_by,
                published_Date: payload.published_Date,
                viewed_by: payload.viewed_by,
                description: payload.description,
                userComment: payload.userComment,
                createdAt: payload.createdAt,
                updatedAt: payload.updatedAt,
            },
        });

        return result;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Could not create article: ${error.message}`);
    }
};

const getAllArticlesFromDB = async () => {
    try {
        const result = await prisma.article.findMany();
        return result;
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Could not get articles: ${error.message}`);
    }
};

export const articleServices = { createArticleIntoDB, getAllArticlesFromDB };
