import { newPool } from "./pool.js";
async function getAllCategories() {
  const { rows } = await newPool.query("SELECT * FROM categories");
  return rows;
}
async function insertCategory(categoryName) {
  await newPool.query("INSERT INTO categories (category_name) VALUES ($1)", [
    categoryName,
  ]);
}
async function getAllItems() {
  const { rows } = await newPool.query("SELECT * FROM items");
}
export { insertCategory, getAllCategories };
