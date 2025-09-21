import { User } from "../modules/User/user.model";
import { TUser } from "../modules/User/user.interface";

const createAdminUser = async (): Promise<void> => {
  try {
    // Check if admin user already exists
    const adminExists = await User.findOne({ email: "admin@inventory.com" });

    if (adminExists) {
      console.log("🔐 Admin user already exists");
      return;
    }

    // Create admin user data
    const adminUserData: TUser = {
      name: "Admin User",
      email: "admin@inventory.com",
      password: "admininventory",
      role: "admin",
      isVerified: true,
      isActive: true,
    };

    // Create the admin user
    const adminUser = await User.create(adminUserData);
    console.log("✅ Admin user created successfully:", {
      id: adminUser._id,
      email: adminUser.email,
      role: adminUser.role,
    });
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    throw error;
  }
};

export default createAdminUser;
