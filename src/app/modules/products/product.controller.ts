import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { productServices } from "./product.service";

const createProduct = catchAsync(async (req: Request, res: Response) => {


    const result = await productServices.createProductIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product Created successfully!",
        data: result
    })
});

const getAllProduct = catchAsync(async (req: Request, res: Response) => {
    const result = await productServices.getAllProductsFromDB(req.query as any);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Products retrieval successfully',
        data: result,
    });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id);
    const result = await productServices.getSingleProductFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Single Product retrieval successfully',
        data: result,
    });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await productServices.updateProductInDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product updated successfully!",
        data: result
    })
});
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id);
    const result = await productServices.deleteProductFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'product Deleted successfully',
        data: result,
    });
});
export const productCotroller = {
    createProduct, getAllProduct, getSingleProduct, updateProduct, deleteProduct
}