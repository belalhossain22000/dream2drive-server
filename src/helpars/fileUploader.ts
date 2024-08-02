import multer from "multer"
import path from "path"
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary';
import { ICloudinaryResponse, IFile } from "../app/interfaces/file";
import config from "../config";

cloudinary.config({
    cloud_name: 'dse4w3es9',
    api_key: '799237289977844',
    api_secret: 'KM5tfi0VKxLd5ylCOLx8D-5ERlo'
});
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })
const uploadMultiple = upload.fields([
    { name: 'productImage', maxCount: 10 },
    { name: 'interiorImage', maxCount: 10 },
    { name: 'exteriorImage', maxCount: 10 },
    { name: 'othersImage', maxCount: 10 },
]);
const uploadToCloudinary = async (file: IFile): Promise<ICloudinaryResponse | undefined> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path,
            (error: Error, result: ICloudinaryResponse) => {
                fs.unlinkSync(file.path)
                if (error) {
                    reject(error)
                }
                else {
                    resolve(result)
                }
            })
    })
};

export const fileUploader = {
    upload,
    uploadMultiple,
    uploadToCloudinary
}