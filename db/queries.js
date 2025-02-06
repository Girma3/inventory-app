import { newPool } from "./pool.js";

// functions to get category ,update and delete them from the table/
async function getAllCategories() {
  try {
    const { rows } = await newPool.query("SELECT * FROM categories");
    return rows;
  } catch {
    console.log("err getting categories", err);
  }
}
async function insertCategory(categoryName) {
  /* try {
    await newPool.query("INSERT INTO categories (category_name) VALUES ($1)", [
      categoryName,
    ]);
  } catch (err) {
    console.log("err inserting to the table", err);
  }*/
}
async function getCategory(categoryId) {
  try {
    const { rows } = await newPool.query(
      "SELECT * FROM categories WHERE category_id = ($1)",
      [categoryId]
    );
    return rows;
  } catch (err) {
    console.log("err getting category", err);
  }
}
async function deleteCategory(categoryId) {
  try {
    await newPool.query(
      "DELETE FROM categories  WHERE category_id = categoryId"
    );
  } catch (err) {
    console.log("err deleting category", err);
  }
}
async function editCategory(categoryId, userValue) {
  try {
    await newPool.query(
      "UPDATE categories SET category_name = $1 WHERE category_id = $2",
      [userValue, categoryId]
    );
  } catch (err) {
    console.log("Error updating category", err);
  }
}
// functions to get all items ,update and delete them from table
async function getAllItems(categoryId) {
  try {
    const { rows } = await newPool.query(
      "SELECT * FROM items INNER JOIN categories ON category_id = item_category_id WHERE category_id = ($1)",
      [categoryId]
    );
    return rows;
  } catch (err) {
    console.log("err getting items data", err);
  }
}
async function getTotalNumberOfItems(categoryId) {
  try {
    const { rows } = await newPool.query(
      "SELECT COUNT(*) FROM items INNER JOIN categories ON category_id = item_category_id WHERE category_id = ($1)",
      [categoryId]
    );
    return rows;
  } catch (err) {
    console.log("err getting items total number", err);
  }
}
async function insertItem(obj) {
  //DESTRUCTURE FORM
  /* try {
    await newPool.query(
      "INSERT INTO  items( item_name,item_description, item_price,item_image_url ) VALUES ($1, $2,  $3, $4),
      []
    );
  } catch (err) {
    console.log("err updating item", err);
  }*/
}
async function editItem(itemId, itemCategory, formBody) {
  //destructure the form first
  try {
    await newPool.query(
      "UPDATE items SET item_name =$1, item_description = $2,item_price=$3,item_image=$4 WHERE items_id = itemId ",
      []
    );
  } catch (err) {
    console.log("err updating item", err);
  }
}
async function deleteItem(itemId) {
  try {
    await newPool.query("DELETE FROM items  WHERE item_id = itemId");
  } catch (err) {
    console.log("err deleting category", err);
  }
}

export {
  insertCategory,
  getAllCategories,
  getCategory,
  deleteCategory,
  editCategory,
  getTotalNumberOfItems,
  getAllItems,
  editItem,
  deleteItem,
};
