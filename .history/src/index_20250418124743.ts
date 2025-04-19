import express from "express";
// import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./app/DB";
import itemRoutes from "./app/routes/itemRoutes";
import customerRoutes from "./app/routes/customerRoutes";
import salesOrderRoutes from "./app/routes/salesOrderRoutes";
import authRoutes from "./app/routes/authRoutes";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import notFound from "./app/middlewares/notFound";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales-orders", salesOrderRoutes);

// Base route
app.get("/", (_, res) => {
  res.json({ message: "Welcome to the Inventory Management API" });
});

// Error handling
app.use(notFound);
app.use(globalErrorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
