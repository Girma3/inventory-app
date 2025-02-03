import express from "express";
import { storeRouter } from "./route/route.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(storeRouter);

app.listen(PORT, () => {
  console.log("server running...");
});
