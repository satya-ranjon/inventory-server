import express from "express";
import { ItemController } from "../modules/Item/item.controller";
import validateRequest from "../middlewares/validateRequest";
import { ItemValidation } from "../modules/Item/item.validation";

const router = express.Router();

// GET all items
router.get("/", ItemController.getAllItems);

// GET single item
router.get("/:id", ItemController.getSingleItem);

// GET low stock items
router.get("/low-stock", ItemController.getLowStockItems);

// CREATE new item
router.post(
  "/create",
  validateRequest(ItemValidation.createItemValidationSchema),
  ItemController.createItem
);

// UPDATE item
router.patch(
  "/:id",
  validateRequest(ItemValidation.updateItemValidationSchema),
  ItemController.updateItem
);

// DELETE item
router.delete("/:id", ItemController.deleteItem);

export default router;
