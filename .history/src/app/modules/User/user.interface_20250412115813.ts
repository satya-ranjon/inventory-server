import { Model, Document } from "mongoose";

export type TRole = "admin" | "manager" | "employee";

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: TRole;
  isVerified?: boolean;
  isActive?: boolean;
};

export interface IUser extends Document, TUser {
  createdAt: Date;
  updatedAt: Date;
}

export type TUserModel = Model<IUser, Record<string, unknown>>;

export type TLoginUser = {
  email: string;
  password: string;
};

export type TLoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
  user: {
    _id: string;
    email: string;
    role: string;
    name: string;
  };
};
