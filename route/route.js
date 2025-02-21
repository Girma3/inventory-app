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
import fs from "fs";
import multer from "multer";

const dir = "./uploads";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
//store upload images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

const storeRouter = Router();

storeRouter.get("/", getHomePage);
//category form to add
storeRouter.get("/create/category", getCategoryForm);
storeRouter.post("/create/category", validateCategory, getCategoryForm);
//to get and see clicked category
storeRouter.get("/category/:id", getDetailPage);
//to update selected category
storeRouter.get("/category/json/:id", handleCategoryJson);
storeRouter.post(
  "/update/category/:id",
  validateCategory,
  handleUpdateCategory
);
storeRouter.delete("/delete/category/:id", handleDeleteCategory);

//add new item
storeRouter.post(
  "/item/new/:id",
  upload.single("itemImage"),
  validateItem,
  handleAddItem
);
//get json for to update item
storeRouter.get("/item/json/:id", handleItemJson);
storeRouter.post("/update/item/:id", validateItem, handleItemEdit);
//move item to another category
storeRouter.put("/move/item/:id", handleItemMove);
storeRouter.delete("/delete/item/:id", handleDeleteItem);

export { storeRouter };
