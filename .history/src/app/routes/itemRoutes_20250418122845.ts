import express from "express";
import { ItemController } from "../modules/Item/item.controller";
import validateRequest from "../middlewares/validateRequest";
import { ItemValidation } from "../modules/Item/item.validation";
import auth from "../middlewares/auth";

const router = express.Router();

// GET all items
router.get("/", ItemController.getAllItems);

// GET single item
router.get("/:id", ItemController.getSingleItem);

// GET low stock items

// CREATE new item - protected route
router.post(
  "/create",
  auth("admin", "manager"),
  validateRequest(ItemValidation.createItemValidationSchema),
  ItemController.createItem
);

// UPDATE item - protected route
router.patch(
  "/:id",
  auth("admin", "manager"),
  validateRequest(ItemValidation.updateItemValidationSchema),
  ItemController.updateItem
);

// DELETE item - protected route
router.delete("/:id", auth("admin"), ItemController.deleteItem);

export default router;
