import createAdminUser from "./createAdminUser";

const runSeeds = async (): Promise<void> => {
  try {
    console.log("🌱 Running database seeds...");

    // Create admin user
    await createAdminUser();

    console.log("✅ All seeds completed successfully");
  } catch (error) {
    console.error("❌ Error running seeds:", error);
    throw error;
  }
};

export default runSeeds;
