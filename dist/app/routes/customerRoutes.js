"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customer_controller_1 = require("../modules/Customer/customer.controller");
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const customer_validation_1 = require("../modules/Customer/customer.validation");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
router.get("/", customer_controller_1.CustomerController.getAllCustomers);
router.get("/:id", customer_controller_1.CustomerController.getSingleCustomer);
router.post("/create", (0, auth_1.default)("admin", "manager"), (0, validateRequest_1.default)(customer_validation_1.CustomerValidation.createCustomerValidationSchema), customer_controller_1.CustomerController.createCustomer);
router.patch("/:id", (0, auth_1.default)("admin", "manager"), (0, validateRequest_1.default)(customer_validation_1.CustomerValidation.updateCustomerValidationSchema), customer_controller_1.CustomerController.updateCustomer);
router.delete("/:id", (0, auth_1.default)("admin"), customer_controller_1.CustomerController.deleteCustomer);
exports.default = router;
//# sourceMappingURL=customerRoutes.js.map