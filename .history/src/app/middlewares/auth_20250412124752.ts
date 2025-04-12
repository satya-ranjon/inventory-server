import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { User } from "../modules/User/user.model";

// Extend the Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

const auth = (...requiredRoles: string[]) => {
  return catchAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
      const token = req.headers.authorization;

      // Check if token exists
      if (!token) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "You are not authorized to access this resource"
        );
      }

      // Verify token
      const tokenWithoutBearer = token.startsWith("Bearer ")
        ? token.slice(7)
        : token;
      console.log("tokenWithoutBearer", tokenWithoutBearer);
      // Verify and decode the token
      let verifiedUser;
      try {
        verifiedUser = jwt.verify(
          tokenWithoutBearer,
          config.jwt.secret as string
        ) as JwtPayload;
      } catch (error) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
      }

      // Check if user exists
      const user = await User.findById(verifiedUser._id);
      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AppError(httpStatus.FORBIDDEN, "User is inactive");
      }

      // Set user in request object
      req.user = verifiedUser;

      // Check if user has required role
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You do not have permission to perform this action"
        );
      }

      next();
    }
  );
};

export default auth;
