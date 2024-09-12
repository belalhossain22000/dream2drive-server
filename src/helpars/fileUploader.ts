import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { ICloudinaryResponse, IFile } from "../app/interfaces/file";
import config from "../config";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join( "/var/www/uploads"));
    // cb(null, path.join( "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// upload single image
const uploadSingle = upload.single("carImage");

// upload multiple image
const uploadMultiple = upload.fields([
  { name: "singleImage", maxCount: 10 },
  { name: "galleryImage", maxCount: 10 },
 
 
]);

const uploadToCloudinary = async (
  file: IFile
): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    // Ensure the file exists before attempting to upload it
    fs.access(file.path, fs.constants.F_OK, (accessError) => {
      if (accessError) {
        console.error(`File not found: ${file.path}`, accessError);
        reject(new Error(`File not found: ${file.path}`));
        return;
      }

      // Upload file to Cloudinary
      cloudinary.uploader.upload(
        file.path,
        (error: Error, result: ICloudinaryResponse) => {
          if (error) {
            reject(error);
            return;
          }

          // // Safely remove the file after upload
          fs.unlink(file.path, (unlinkError) => {
            if (unlinkError) {
              console.error(`Failed to delete file: ${file.path}`, unlinkError);
              // Log the error but do not reject the Cloudinary upload result
            }
          });

          resolve(result);
        }
      );
    });
  });
};

export const fileUploader = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadToCloudinary,
};
