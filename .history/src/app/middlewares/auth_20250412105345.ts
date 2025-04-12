import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    const verifiedUser = jwt.verify(
      token,
      config.jwt.secret as string
    ) as JwtPayload;

    req.user = verifiedUser;

    if (roles.length && !roles.includes(verifiedUser.role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You do not have permission to perform this action"
      );
    }

    next();
  });
};

export default auth;
