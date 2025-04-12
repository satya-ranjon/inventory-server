import mongoose from "mongoose";

const handleCastError = (err: mongoose.Error.CastError) => {
  const errorMessage = `Invalid ${err.path}: ${err.value}`;
  return {
    statusCode: 400,
    message: "Cast Error",
    errorMessage,
  };
};

export default handleCastError;
