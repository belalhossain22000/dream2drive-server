import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create directory if it doesn't exist
const storagePath = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storagePath); // Save files to the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Middleware to upload single/multiple files
const uploadSingle = upload.single('carImage');
const uploadMultiple = upload.fields([
  { name: 'singleImage', maxCount: 10 },
  { name: 'galleryImage', maxCount: 100 },
]);

export const fileUploaderVps = {
  uploadSingle,
  uploadMultiple,
};
