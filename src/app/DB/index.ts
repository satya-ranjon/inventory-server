import mongoose from "mongoose";
import config from "../config";
import runSeeds from "../seeds";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = config.database_url as string;
    await mongoose.connect(mongoURI);
    console.log("📄 Database connection established");

    // Run seeds after successful database connection
    await runSeeds();

    mongoose.connection.on("error", (err) => {
      console.error("Database connection error:", err);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
