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
}
const createProduct = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const files = req.files as any;

  if (!files || files.length === 0) {
    return res.status(400).send({ message: "No files uploaded" });
  }

  // Extract files from the request
  const productSingleImage = files.singleImage || [];
  const productImageFiles = files.galleryImage || [];

  // Collect local file paths (since you are now uploading to your VPS)
  const singleProductImageResults = productSingleImage.map((file: any) => ({
    fileName: file.filename,
    url: `/uploads/${file.originalname}`,
  }));

  const productImageResults = productImageFiles.map((file: any) => ({
    fileName: file.filename,
    url: `/uploads/${file.originalname}`,
  }));

  // Create the files data object with URLs
  const filesData = {
    galleryImage: productImageResults.map((product: any) => product.url),
    singleImage: singleProductImageResults.map((single: any) => single.url),
  };
console.log(filesData)
  const result = await productServices.createProductIntoDB(
    filesData,
    req.body.body,
    userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product Created successfully!",
    data: result,
  });
});

// get all products

const getAllProduct = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, productsFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
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
  // console.log(id);
  const result = await productServices.getSingleProductFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single Product retrieval successfully",
    data: result,
  });
});

// update products
const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const files = req?.files as any;

  // Parse incoming data from the request body
  const data = req?.body?.body;
  const parsedData = JSON.parse(data);

  // Initialize arrays to store existing and new image URLs
  let singleImage: string[] = parsedData.singleImage || [];
  let galleryImage: string[] = parsedData.galleryImage || [];
  // let interiorImage: string[] = parsedData.interiorImage || [];
  // let exteriorImage: string[] = parsedData.exteriorImage || [];
  // let othersImage: string[] = parsedData.othersImage || [];

  // Check if any files are uploaded
  if (files && Object.keys(files).length > 0) {
    // Extract the product images from payload
    const productSingleImage = files.singleImage || [];
    const productImageFiles = files.galleryImage || [];
    // const interiorImageFiles = files.interiorImage || [];
    // const exteriorImageFiles = files.exteriorImage || [];
    // const othersImageFiles = files.othersImage || [];

    // Upload product images to Cloudinary
    const productImageResults = productImageFiles.map((file: any) =>
      fileUploader.uploadToCloudinary(file)
    );
    // const interiorImageResults = interiorImageFiles.map((file: any) =>
    //   fileUploader.uploadToCloudinary(file)
    // );
    // const exteriorImageResults = exteriorImageFiles.map((file: any) =>
    //   fileUploader.uploadToCloudinary(file)
    // );
    // const othersImageResults = othersImageFiles.map((file: any) =>
    //   fileUploader.uploadToCloudinary(file)
    // );
    const singleProductImageResults = productSingleImage.map((file: any) =>
      fileUploader.uploadToCloudinary(file)
    );

    // Await the results from Cloudinary
    const productData = await Promise.all(productImageResults);
    // const interiorData = await Promise.all(interiorImageResults);
    // const exteriorData = await Promise.all(exteriorImageResults);
    // const othersData = await Promise.all(othersImageResults);
    const singleImageData = await Promise.all(singleProductImageResults);

    // Extract URLs from Cloudinary responses
    const existingSingleImage = singleImageData.map(
      (single) => single.secure_url
    );
    const existingGalleryImage = productData.map(
      (product) => product.secure_url
    );
    // const existingInteriorImage = interiorData.map(
    //   (interior) => interior.secure_url
    // );
    // const existingExteriorImage = exteriorData.map(
    //   (exterior) => exterior.secure_url
    // );
    // const existingOthersImage = othersData.map((others) => others.secure_url);

    // Merge existing and new images
    singleImage = [...singleImage, ...existingSingleImage];
    galleryImage = [...galleryImage, ...existingGalleryImage];
    // interiorImage = [...interiorImage, ...existingInteriorImage];
    // exteriorImage = [...exteriorImage, ...existingExteriorImage];
    // othersImage = [...othersImage, ...existingOthersImage];
  }

  // Format the data to send to the database
  const updateData = {
    ...parsedData,
    singleImage,
    galleryImage,
    // interiorImage,
    // exteriorImage,
    // othersImage,
  };

  // Update the product in the database
  const result = await productServices.updateProductInDB(id, updateData);

  // Send response back to the client
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product updated successfully!",
    data: result,
  });
});

const updateProductStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await productServices.updateProductStatus(req.body, id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "product updated successfully",
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

const getProductGroupings = catchAsync(async (req: Request, res: Response) => {
  const result = await productServices.getProductGroupings();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " All Product list reterive successfully",
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
  getProductGroupings,
  updateProductStatus,
};
