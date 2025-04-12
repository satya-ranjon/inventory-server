"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const DB_1 = __importDefault(require("./app/DB"));
const itemRoutes_1 = __importDefault(require("./app/routes/itemRoutes"));
const customerRoutes_1 = __importDefault(require("./app/routes/customerRoutes"));
const salesOrderRoutes_1 = __importDefault(require("./app/routes/salesOrderRoutes"));
const authRoutes_1 = __importDefault(require("./app/routes/authRoutes"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, DB_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes_1.default);
app.use("/api/items", itemRoutes_1.default);
app.use("/api/customers", customerRoutes_1.default);
app.use("/api/sales-orders", salesOrderRoutes_1.default);
app.get("/", (_, res) => {
    res.json({ message: "Welcome to the Inventory Management API" });
});
app.use(notFound_1.default);
app.use(globalErrorhandler_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map