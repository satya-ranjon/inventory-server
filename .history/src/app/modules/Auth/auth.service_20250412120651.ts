import { TLoginUser, TLoginUserResponse, TUser } from "../User/user.interface";
import { User } from "../User/user.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config";

const registerUser = async (payload: TUser) => {
  // Check if user already exists
  const userExists = await User.findOne({ email: payload.email });
  if (userExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  // Create new user
  const result = await User.create(payload);
  return result;
};

const loginUser = async (payload: TLoginUser): Promise<TLoginUserResponse> => {
  // Check if user exists
  const user = await User.findOne({ email: payload.email }).select("+password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if password matches
  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError(httpStatus.FORBIDDEN, "User is inactive");
  }

  // JWT sign options
  const accessTokenOptions: SignOptions = {
    expiresIn: config.jwt.expires_in as any,
  };

  const refreshTokenOptions: SignOptions = {
    expiresIn: config.jwt.refresh_expires_in as any,
  };

  // Create JWT tokens
  const accessToken = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    config.jwt.secret as string,
    accessTokenOptions
  );

  const refreshToken = jwt.sign(
    { _id: user._id },
    config.jwt.refresh_secret as string,
    refreshTokenOptions
  );

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    },
  };
};

const refreshToken = async (token: string) => {
  // Verify refresh token
  let decodedToken;
  try {
    decodedToken = jwt.verify(
      token,
      config.jwt.refresh_secret as string
    ) as JwtPayload;
  } catch (error) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired refresh token"
    );
  }

  // Find user
  const user = await User.findById(decodedToken._id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError(httpStatus.FORBIDDEN, "User is inactive");
  }

  // JWT sign options
  const accessTokenOptions: SignOptions = {
    expiresIn: config.jwt.expires_in as any,
  };

  const refreshTokenOptions: SignOptions = {
    expiresIn: config.jwt.refresh_expires_in as any,
  };

  // Create new tokens
  const accessToken = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    config.jwt.secret as string,
    accessTokenOptions
  );

  const newRefreshToken = jwt.sign(
    { _id: user._id },
    config.jwt.refresh_secret as string,
    refreshTokenOptions
  );

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const AuthService = {
  registerUser,
  loginUser,
  refreshToken,
};
