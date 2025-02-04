import { Router } from "express";
import { getHomePage, getCategoryForm,validateUser } from "../controllers/store.js";
const storeRouter = Router();
storeRouter.get("/", getHomePage);
storeRouter.get("/create/category", getCategoryForm);
storeRouter.post("/create/category",validateUser, getCategoryForm);
export { storeRouter };
