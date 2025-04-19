"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const salesOrder_controller_1 = require("./salesOrder.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const salesOrder_validation_1 = require("./salesOrder.validation");
const router = express_1.default.Router();
router.get("/", salesOrder_controller_1.SalesOrderController.getAllSalesOrders);
router.post("/", (0, validateRequest_1.default)(salesOrder_validation_1.SalesOrderValidation.createSalesOrderValidationSchema), salesOrder_controller_1.SalesOrderController.createSalesOrder);
router.get("/:id", salesOrder_controller_1.SalesOrderController.getSalesOrderById);
router.put("/:id", (0, validateRequest_1.default)(salesOrder_validation_1.SalesOrderValidation.updateSalesOrderValidationSchema), salesOrder_controller_1.SalesOrderController.updateSalesOrder);
router.patch("/:id/status", (0, validateRequest_1.default)(salesOrder_validation_1.SalesOrderValidation.updateOrderStatusValidationSchema), salesOrder_controller_1.SalesOrderController.updateOrderStatus);
router.patch("/:id/payment", (0, validateRequest_1.default)(salesOrder_validation_1.SalesOrderValidation.updatePaymentValidationSchema), salesOrder_controller_1.SalesOrderController.updatePayment);
router.delete("/:id", salesOrder_controller_1.SalesOrderController.deleteSalesOrder);
exports.SalesOrderRoutes = router;
//# sourceMappingURL=salesOrder.route.js.map