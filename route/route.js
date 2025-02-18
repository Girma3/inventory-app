import { Router } from "express";
import {
  getHomePage,
  getCategoryForm,
  validateCategory,
  getDetailPage,
  handleDeleteCategory,
  handleItemEdit,
  handleDeleteItem,
  handleAddItem,
  handleUpdateCategory,
  handleItemJson,
  validateItem,
  handleCategoryJson,
  handleItemMove,
} from "../controllers/store.js";
const storeRouter = Router();

storeRouter.get("/", getHomePage);
//create category form

storeRouter.get("/create/category", getCategoryForm);
storeRouter.post("/create/category", validateCategory, getCategoryForm);

storeRouter.get("/category/:id", getDetailPage);
storeRouter.post(
  "/update/category/:id",
  validateCategory,
  handleUpdateCategory
);
storeRouter.get("/category/json/:id", handleCategoryJson);

storeRouter.delete("/delete/category/:id", handleDeleteCategory);

//storeRouter.get("/new/item/:id", handleAddItem);

storeRouter.get("/item/json/:id", handleItemJson);
storeRouter.post("/item/new/:id", validateItem, handleAddItem);
storeRouter.post("/update/item/:id", validateItem, handleItemEdit);
storeRouter.put("/move/item/:id", handleItemMove);
storeRouter.delete("/delete/item/:id", handleDeleteItem);
//update category
// storeRouter.get("/category/update/:id", (req, res) => {
//   const category = req.params.id;

//   handleUpdateCategory(req, res, category);
// });

//get category as json

export { storeRouter };
