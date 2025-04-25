import { TCreateEmployee } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createEmployee = async (payload: TCreateEmployee) => {
  // Check if user already exists
  const userExists = await User.findOne({ email: payload.email });
  if (userExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  // Create employee with role set to employee
  const employeeData = {
    ...payload,
    role: "employee",
  };

  // Create new employee
  const result = await User.create(employeeData);
  return result;
};

const updateProfile = async (
  userId: string,
  payload: { name: string; email: string }
) => {
  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check if email is being changed and if it already exists
  if (user.email !== payload.email) {
    const emailExists = await User.findOne({ email: payload.email });
    if (emailExists) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "This email is already in use by another account"
      );
    }
  }

  // Update user profile
  const result = await User.findByIdAndUpdate(
    userId,
    {
      name: payload.name,
      email: payload.email,
    },
    { new: true, runValidators: true }
  ).select("-password");

  return result;
};

export const UserService = {
  createEmployee,
  updateProfile,
};
