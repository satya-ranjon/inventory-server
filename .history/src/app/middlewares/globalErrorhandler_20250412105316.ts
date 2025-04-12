import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { TGenericErrorResponse } from "../interface/error";
import handleCastError from "../errors/handleCastError";
import handleValidationError from "../errors/handleValidationError";
import handleZodError from "../errors/handleZodError";
import handleDuplicateError from "../errors/handleDuplicateError";
import mongoose from "mongoose";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorMessages: any = [];
  let errorMessage = "";
  let stack = "";

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (err instanceof mongoose.Error.ValidationError) {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (err instanceof mongoose.Error.CastError) {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessage;
  } else if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = simplifiedError.errorMessage;
  } else if (err instanceof Error) {
    message = err.message;
    stack = err.stack || "";

    // If custom AppError
    if ("statusCode" in err) {
      statusCode = (err as any).statusCode;
    }
  }

  const responseData: TGenericErrorResponse = {
    success: false,
    statusCode,
    message,
    errorMessages,
    stack: process.env.NODE_ENV === "development" ? stack : undefined,
  };

  if (errorMessage) {
    responseData.errorMessage = errorMessage;
  }

  res.status(statusCode).json(responseData);
};

export default globalErrorHandler;
