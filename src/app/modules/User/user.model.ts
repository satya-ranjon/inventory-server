import { Schema, model } from "mongoose";
import { IUser, TPermission, TUserModel } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const userSchema = new Schema<IUser, TUserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "employee"],
      required: true,
    },
    permissions: {
      type: [String],
      enum: ["item", "customer", "sales", "dashboard"],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  // Hash password with bcrypt
  const salt = Number(config.bcrypt_salt_rounds);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Remove password field when converting to JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

export const User = model<IUser, TUserModel>("User", userSchema);
