"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const customer_controller_1 = require("./customer.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const customer_validation_1 = require("./customer.validation");
const router = express_1.default.Router();
router.get("/", customer_controller_1.CustomerController.getAllCustomers);
router.post("/", (0, validateRequest_1.default)(customer_validation_1.CustomerValidation.createCustomerValidationSchema), customer_controller_1.CustomerController.createCustomer);
router.get("/:id", customer_controller_1.CustomerController.getCustomerById);
router.put("/:id", (0, validateRequest_1.default)(customer_validation_1.CustomerValidation.updateCustomerValidationSchema), customer_controller_1.CustomerController.updateCustomer);
router.delete("/:id", customer_controller_1.CustomerController.deleteCustomer);
exports.CustomerRoutes = router;
//# sourceMappingURL=customer.route.js.map