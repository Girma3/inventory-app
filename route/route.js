import { Router } from "express";
import { getHomePage } from "../controllers/store.js";
const storeRouter = Router();
storeRouter.get("/", getHomePage);
export { storeRouter };
