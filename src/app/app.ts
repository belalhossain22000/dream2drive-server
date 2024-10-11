import express, { Application, NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from ".";
import GlobalErrorHandler from "./middlewares/globalErrorHandler";
import { scheduleAuctionCheck } from "./modules/products/product.service";
import path from "path";
const app: Application = express();
export const corsOptions = {
  origin: [
    "http://localhost:3001",
    "https://collecting-cars-font-end.vercel.app",
    "http://localhost:3000",
    "https://dream-2-drive.vercel.app",
    "https://dream2drive.com.au",
    "dream2drive.com.au",
    "https://dream2drive.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Middleware setup
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Route handler for root endpoint
app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    status: httpStatus.OK,
    Message: "Dream2drive car server is running..",
  });
});

// Start the cron job
scheduleAuctionCheck();
// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join("/var/www/uploads")));
// Router setup
app.use("/api/v1", router);

// Error handling middleware
app.use(GlobalErrorHandler);

// Not found handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

// Example global error handler middleware (globalErrorHandler.ts)
const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Global error handler:", err);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
};

export default app;
