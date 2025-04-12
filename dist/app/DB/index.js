"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
const connectDB = async () => {
    try {
        const mongoURI = config_1.default.database_url;
        await mongoose_1.default.connect(mongoURI);
        console.log("📄 Database connection established");
        mongoose_1.default.connection.on("error", (err) => {
            console.error("Database connection error:", err);
        });
    }
    catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=index.js.map