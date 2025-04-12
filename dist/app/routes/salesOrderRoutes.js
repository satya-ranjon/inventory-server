"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const salesOrder_controller_1 = require("../modules/SalesOrder/salesOrder.controller");
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const salesOrder_validation_1 = require("../modules/SalesOrder/salesOrder.validation");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
router.get("/", salesOrder_controller_1.SalesOrderController.getAllSalesOrders);
router.get("/:id", salesOrder_controller_1.SalesOrderController.getSingleSalesOrder);
router.post("/create", (0, auth_1.default)("admin", "manager", "employee"), (0, validateRequest_1.default)(salesOrder_validation_1.SalesOrderValidation.createSalesOrderValidationSchema), salesOrder_controller_1.SalesOrderController.createSalesOrder);
router.patch("/:id", (0, auth_1.default)("admin", "manager"), (0, validateRequest_1.default)(salesOrder_validation_1.SalesOrderValidation.updateSalesOrderValidationSchema), salesOrder_controller_1.SalesOrderController.updateSalesOrder);
router.delete("/:id", (0, auth_1.default)("admin"), salesOrder_controller_1.SalesOrderController.deleteSalesOrder);
exports.default = router;
//# sourceMappingURL=salesOrderRoutes.js.map