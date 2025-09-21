import mongoose from "mongoose";
import config from "../app/config";
import runSeeds from "../app/seeds";

const resetDatabase = async (): Promise<void> => {
  try {
    console.log("🗑️  Starting database reset...");
    
    // Connect to MongoDB
    const mongoURI = config.database_url as string;
    await mongoose.connect(mongoURI);
    console.log("📄 Database connection established");

    // Clear all collections
    console.log("🧹 Clearing all collections...");
    
    // Get all collection names
    const collections = mongoose.connection.collections;
    
    for (const collection of Object.values(collections)) {
      await collection.deleteMany({});
      console.log(`✅ Cleared collection: ${collection.collectionName}`);
    }

    console.log("🌱 Running seeds after reset...");
    
    // Run seeds to recreate initial data
    await runSeeds();

    console.log("✅ Database reset and seeding completed successfully");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("📄 Database connection closed");
    process.exit(0);
  }
};

// Run the script
resetDatabase();