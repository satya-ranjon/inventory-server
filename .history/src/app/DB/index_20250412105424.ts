import mongoose from "mongoose";
import config from "../config";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.database_url as string);
    console.log("📄 Database connection established");

    mongoose.connection.on("error", (err) => {
      console.error("Database connection error:", err);
    });
  } catch (err) {
    console.error("Failed to connect to database:", err);
  }
};

export default connectDB;
