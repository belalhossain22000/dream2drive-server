import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const GlobalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: any = httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let errorDetails = err || null;

  // Prisma Client Validation Error
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation Error: Please check your input.";
    errorDetails = err.message;
  }
  // Known Request Errors (e.g., P2002 for unique constraint violation)
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = httpStatus.CONFLICT;
        message = "Duplicate key error: A unique constraint was violated.";
        errorDetails = err.meta;
        break;
      case "P2001":
        statusCode = httpStatus.NOT_FOUND;
        message = "Record not found with the provided criteria.";
        errorDetails = err.meta;
        break;
      case "P2016":
        statusCode = httpStatus.NOT_FOUND;
        message = "Record not found.";
        errorDetails = err.meta;
        break;
      case "P2003":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Foreign key constraint failed.";
        errorDetails = err.meta;
        break;
      case "P2025":
        statusCode = httpStatus.NOT_FOUND;
        message =
          "An operation failed because it depends on a record that does not exist.";
        errorDetails = err.meta;
        break;
      // Add other Prisma error codes as needed
      default:
        message = `Prisma error code ${err.code} occurred.`;
        errorDetails = err.meta;
        break;
    }
  }
  // Prisma Client Initialization Error
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message =
      "Failed to initialize Prisma Client. Check your database connection or Prisma configuration.";
    errorDetails = err.message;
  }
  // Prisma Client Rust Panic Error
  else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message =
      "A critical error occurred in the Prisma engine. Please try again later.";
    errorDetails = err.message;
  }
  // Prisma Client Unknown Request Error
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "An unknown error occurred while processing the request.";
    errorDetails = err.message;
  }
  // Generic Error Handling (e.g., JavaScript Errors)
  else if (err instanceof SyntaxError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Syntax error in the request. Please verify your input.";
    errorDetails = err.message;
  } else if (err instanceof TypeError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Type error in the application. Please verify your input.";
    errorDetails = err.message;
  } else if (err instanceof ReferenceError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Reference error in the application. Please verify your input.";
    errorDetails = err.message;
  }
  // Catch any other error type
  else {
    message = "An unexpected error occurred!";
    errorDetails = err.message || null;
  }

  res.status(statusCode).json({
    success,
    message,
    error: errorDetails,
  });
};

export default GlobalErrorHandler;
