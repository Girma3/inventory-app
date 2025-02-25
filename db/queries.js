import newPool from "./pool.js";

// functions to get category ,update and delete them from the table/
async function getAllCategories() {
  try {
    const { rows } = await newPool.query("SELECT * FROM categories");
    return rows;
  } catch {
    console.log("err getting categories", err);
  }
}
async function insertCategory(categoryName, categoryDescription) {
  if (categoryName === undefined || categoryDescription === undefined) {
    throw new Error("Both categoryName and categoryDescription are required");
  }
  try {
    await newPool.query(
      "INSERT INTO categories (category_name, category_description) VALUES ($1, $2)",
      [categoryName, categoryDescription]
    );
    return true;
  } catch (err) {
    console.log("Error inserting into the table", err);
  }
}
async function getCategory(categoryId) {
  try {
    const { rows } = await newPool.query(
      "SELECT * FROM categories WHERE category_id = $1",
      [categoryId]
    );
    return rows;
  } catch (err) {
    console.log("Error getting category", err);
  }
}
async function getCategoryByName(categoryName) {
  try {
    const { rows } = await newPool.query(
      "SELECT * FROM categories WHERE category_name = $1",
      [categoryName]
    );
    return rows;
  } catch (err) {
    console.log("Error getting category by name", err);
  }
}

async function deleteCategory(categoryId) {
  try {
    await newPool.query("BEGIN");
    await newPool.query("DELETE FROM items WHERE item_category_id = $1", [
      categoryId,
    ]);
    await newPool.query("DELETE FROM categories WHERE category_id = $1", [
      categoryId,
    ]);
    await newPool.query("COMMIT");
  } catch (err) {
    await newPool.query("ROLLBACK");
    console.error("Error deleting category:", err);
  }
}
async function editCategory(categoryId, categoryName, categoryDescription) {
  try {
    await newPool.query(
      "UPDATE categories SET category_name = $1, category_description = $2 WHERE category_id = $3",
      [categoryName, categoryDescription, categoryId]
    );
  } catch (err) {
    console.error("Error updating category:", err);
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
async function insertItem(
  itemName,
  itemDescription,
  itemPrice,
  itemInStock,
  itemImage,
  categoryId
) {
  if (!itemName) return;
  try {
    const result = await newPool.query(
      "INSERT INTO items (item_name, item_description, item_price,item_instock, item_image_url,item_category_id) VALUES ($1, $2, $3, $4,$5,$6) RETURNING *",
      [itemName, itemDescription, itemPrice, itemInStock, itemImage, categoryId]
    );
    return result.rows[0]; // Return the inserted item
  } catch (err) {
    console.error("Error inserting item:", err);
  }
}

async function editItem(
  itemId,
  itemName,
  itemDescription,
  itemPrice,
  itemInStock,
  itemImage
) {
  if (!itemId) return;
  try {
    await newPool.query(
      "UPDATE items SET item_name = $1, item_description = $2, item_price = $3,item_instock = $4, item_image_url = $5 WHERE item_id = $6",
      [itemName, itemDescription, itemPrice, itemInStock, itemImage, itemId]
    );
  } catch (err) {
    console.error("Error updating item:", err);
  }
}
async function deleteItem(itemId) {
  try {
    await newPool.query("DELETE FROM items  WHERE item_id = ($1)", [itemId]);
  } catch (err) {
    console.log("err deleting item", err);
  }
}
async function getItemById(itemId) {
  try {
    const { rows } = await newPool.query(
      "SELECT * FROM items WHERE item_id =($1)",
      [itemId]
    );
    return rows;
  } catch (err) {
    console.log("err finding item", err);
  }
}
async function totalItemsPrice() {
  try {
    const { rows } = await newPool.query(
      "SELECT SUM(item_price * item_instock) FROM items"
    );
    return rows;
  } catch (err) {
    console.log(err, "can't sum the price total");
  }
}
async function totalCategories() {
  try {
    const { rows } = await newPool.query(
      "SELECT COUNT(*) AS total_categories from categories"
    );
    return rows;
  } catch (err) {
    console.log(err, "can't count categories");
  }
}
async function totalItems() {
  try {
    const { rows } = await newPool.query(
      "SELECT COUNT(*) AS total_items FROM items"
    );
    return rows;
  } catch (err) {
    console.log(err, "can't find total items count");
  }
}
async function moveItem(itemId, destinationCategory) {
  try {
    const item = await getItemById(itemId);
    if (item.length === 0) {
      throw new Error("Item not found");
    }
    const {
      item_name,
      item_description,
      item_price,
      item_instock,
      item_image_url,
    } = item[0];
    await newPool.query(
      "UPDATE items SET item_name = $1, item_description = $2, item_price = $3,item_instock=$4, item_image_url = $5, item_category_id = $6 WHERE item_id = $7",
      [
        item_name,
        item_description,
        item_price,
        item_inStock,
        item_image_url,
        destinationCategory,
        itemId,
      ]
    );
  } catch (err) {
    console.log("Error while trying to move item:", err);
  }
}
async function findCategory(value) {
  try {
    const { rows } = await newPool.query(
      "SELECT * FROM categories WHERE category_name ILIKE $1",
      [`%${value}%`]
    );
    return rows.length ? rows : [];
  } catch (err) {
    console.log("Error finding category:", err);
  }
}
async function findItem(value) {
  try {
    const { rows } = await newPool.query(
      "SELECT * FROM items WHERE item_name ILIKE $1",
      [`%${value}%`]
    );
    return rows.length ? rows : [];
  } catch (err) {
    console.log(err, "can't find item");
  }
}
async function findItemStockStatus() {
  try {
    const {rows } = await newPool.query(
      "SELECT *  FROM items WHERE item_instock = 0 "
    );
    return rows
  } catch (err) {
    console.log(err, "err while finding stock status for item");
  }
}
export {
  insertCategory,
  getAllCategories,
  getCategory,
  getCategoryByName,
  deleteCategory,
  editCategory,
  getTotalNumberOfItems,
  getAllItems,
  editItem,
  totalItemsPrice,
  totalCategories,
  totalItems,
  getItemById,
  insertItem,
  deleteItem,
  moveItem,
  findCategory,
  findItem,
  findItemStockStatus
};
