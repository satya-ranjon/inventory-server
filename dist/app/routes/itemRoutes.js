"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const item_controller_1 = require("../modules/Item/item.controller");
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const item_validation_1 = require("../modules/Item/item.validation");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
router.get("/", item_controller_1.ItemController.getAllItems);
router.get("/:id", item_controller_1.ItemController.getSingleItem);
router.get("/low-stock", item_controller_1.ItemController.getLowStockItems);
router.post("/create", (0, auth_1.default)("admin", "manager"), (0, validateRequest_1.default)(item_validation_1.ItemValidation.createItemValidationSchema), item_controller_1.ItemController.createItem);
router.patch("/:id", (0, auth_1.default)("admin", "manager"), (0, validateRequest_1.default)(item_validation_1.ItemValidation.updateItemValidationSchema), item_controller_1.ItemController.updateItem);
router.delete("/:id", (0, auth_1.default)("admin"), item_controller_1.ItemController.deleteItem);
exports.default = router;
//# sourceMappingURL=itemRoutes.js.map