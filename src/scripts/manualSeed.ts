import mongoose from "mongoose";
import config from "../app/config";
import createAdminUser from "../app/seeds/createAdminUser";

const availableSeeds = {
  admin: createAdminUser,
  all: async () => {
    await createAdminUser();
  },
};

const runSpecificSeed = async (seedName?: string): Promise<void> => {
  try {
    console.log("🌱 Starting manual seed script...");

    // Connect to MongoDB
    const mongoURI = config.database_url as string;
    await mongoose.connect(mongoURI);
    console.log("📄 Database connection established");

    // Determine which seed to run
    const seedToRun = seedName || "all";

    if (!Object.keys(availableSeeds).includes(seedToRun)) {
      console.error(`❌ Invalid seed name: ${seedToRun}`);
      console.log(`Available seeds: ${Object.keys(availableSeeds).join(", ")}`);
      return;
    }

    console.log(`🌱 Running seed: ${seedToRun}`);
    await availableSeeds[seedToRun as keyof typeof availableSeeds]();

    console.log("✅ Manual seed script completed successfully");
  } catch (error) {
    console.error("❌ Error running manual seed script:", error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("📄 Database connection closed");
    process.exit(0);
  }
};

// Get seed name from command line arguments
const seedName = process.argv[2];
runSpecificSeed(seedName);
