import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { productServices } from "./product.service";
import { fileUploader } from "../../../helpars/fileUploader";
import { json } from "stream/consumers";
import pick from "../../../shared/pick";
import { productsFilterableFields } from "./product.constants";
export interface ICloudinaryResult {
  secure_url: string;
  // Add other properties if needed
}
const createProduct = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as any;

  if (!files || files.length === 0) {
    return res.status(400).send({ message: "No files uploaded" });
  }

  const productImageFiles = files.productImage;
  const interiorImageFiles = files.interiorImage || [];
  const exteriorImageFiles = files.exteriorImage || [];
  const othersImageFiles = files.othersImage || [];
  const productSingleImage=files.productSingleImage ||[];
  const productImageResults = productImageFiles.map((file: any) => fileUploader.uploadToCloudinary(file))
  const interiorImageResults = interiorImageFiles.map((file: any) => fileUploader.uploadToCloudinary(file));
  const exteriorImageResults = exteriorImageFiles.map((file: any) => fileUploader.uploadToCloudinary(file));
  const othersImageResults = othersImageFiles.map((file: any) => fileUploader.uploadToCloudinary(file));
  const singleProductImageResults = productSingleImage.map((file: any) => fileUploader.uploadToCloudinary(file));
  

  const productData = await Promise.all(productImageResults)
  const interiorData = await Promise.all(interiorImageResults)
  const exteriorData = await Promise.all(exteriorImageResults)
  const othersData = await Promise.all(othersImageResults)
  const singleImageData=await Promise.all(singleProductImageResults)
const productURL=productData.map(product=>product.secure_url);
const interiorURL=interiorData.map(interior=>interior.secure_url);
const expteriorURL=exteriorData.map(exterior=>exterior.secure_url);
const othersURL=othersData.map(others=>others.secure_url);
const singleImageURL=singleImageData.map(single=>single.secure_url);
  const filesData = {
    productURL,interiorURL,expteriorURL,othersURL,singleImageURL
  };

  const result = await productServices.createProductIntoDB(filesData , req.body.body);

  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product Created successfully!",
      data: result
  })
});

const getAllProduct = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, productsFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
  const result = await productServices.getAllProductsFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products retrieval successfully",
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
    message: "Single Product retrieval successfully",
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
    data: result,
  });
});
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  const result = await productServices.deleteProductFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "product Deleted successfully",
    data: result,
  });
});

const createFeaturedProduct = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await productServices.createFeaturedProduct(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "product featured successfully",
      data: result,
    });
  }
);
const getFeaturedProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await productServices.getFeaturedProduct();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " featured product reterive successfully",
    data: result,
  });
});

export const productCotroller = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createFeaturedProduct,
  getFeaturedProduct,
};
