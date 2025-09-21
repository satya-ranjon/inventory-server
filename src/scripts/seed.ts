import mongoose from "mongoose";
import config from "../app/config";
import runSeeds from "../app/seeds";

const runSeedsScript = async (): Promise<void> => {
  try {
    console.log("🌱 Starting seed script...");
    
    // Connect to MongoDB
    const mongoURI = config.database_url as string;
    await mongoose.connect(mongoURI);
    console.log("📄 Database connection established");

    // Run seeds
    await runSeeds();

    console.log("✅ Seed script completed successfully");
  } catch (error) {
    console.error("❌ Error running seed script:", error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("📄 Database connection closed");
    process.exit(0);
  }
};

// Run the script
runSeedsScript();