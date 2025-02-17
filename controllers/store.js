import {
  getAllCategories,
  getAllItems,
  getCategory,
  getTotalNumberOfItems,
  insertCategory,
  deleteCategory,
  deleteItem,
  getItemById,
  insertItem,
  editCategory,
  editItem,
  totalItemsPrice,
  totalItems,
  totalCategories,
} from "../db/queries.js";
import { body, validationResult } from "express-validator";
let lengthErr = "must be between 3 and 40 characters";
let validateCategory = [
  body("categoryName")
    .trim()
    .notEmpty()
    .withMessage("Name can't be empty!")
    .isLength({ min: 3, max: 40 })
    .withMessage(`${lengthErr}`),
  body("categoryDescription")
    .trim()
    .notEmpty()
    .withMessage("Description can't be empty!")
    .isLength({ min: 3, max: 40 })
    .withMessage(`${lengthErr}`),
];

let validateItem = [
  body("itemName")
    .trim()
    .notEmpty()
    .withMessage("Item name can't be empty")
    .isLength({ min: 3, max: 40 })
    .withMessage(`${lengthErr}`),
  body("itemDescription")
    .trim()
    .notEmpty()
    .withMessage("Item description can't be empty")
    .isLength({ min: 3, max: 40 })
    .withMessage(`${lengthErr}`),
  body("itemPrice").trim().notEmpty().withMessage("price can't be empty"),
];
async function getHomePage(req, res) {
  const errors = validationResult(req);
  try {
    const allCategories = await getAllCategories();
    const sumPrice = await totalItemsPrice();
    const countItems = await totalItems();
    const countCategories = await totalCategories();

    const categoriesWithItemCounts = await Promise.all(
      allCategories.map(async (category) => {
        const itemCount = await getTotalNumberOfItems(category.category_id);
        return { ...category, itemCount: itemCount[0] };
      })
    );

    res.render("home", {
      title: "Home",
      categories: categoriesWithItemCounts,
      countCategories: countCategories[0].total_categories,
      countItems: countItems[0].total_items,
      sumPrice: sumPrice[0].sum,
      errors: errors.array(),
    });
  } catch (err) {
    console.error("Can't get category data", err);
    res.status(500).send("Server Error");
  }
}
async function getCategoryForm(req, res) {
  const errors = validationResult(req);
  const { categoryName, categoryDescription } = req.body;
  console.log(categoryName, categoryDescription);

  if (!errors.isEmpty()) {
    return res.json({ errors: errors.array() });
  }

  try {
    await insertCategory(categoryName, categoryDescription);
    //categoryDescription);
    return res.status(200).json({ message: "Category created successfully!" });
    //res.redirect("/");
  } catch (err) {
    console.error("Can't create category", err);
    return res.status(500).send("Server Error");
  }
}
async function getDetailPage(req, res) {
  const categoryId = req.params.id;

  try {
    const selectedCategory = await getCategory(categoryId);
    if (!selectedCategory) {
      return res.status(404).send("Category not found");
    }
    const selectedCategoryItems = await getAllItems(categoryId);
    const categoryName = selectedCategory[0].category_name;
    // console.log(selectedCategory);

    res.render("detail-page", {
      title: categoryName,
      categoryName: categoryName,
      categoryId: categoryId,
      items: selectedCategoryItems,
      category: selectedCategory[0],
      errors: [],
      item: null,
    });
  } catch (err) {
    console.error("Error getting detail page", err);
    res.status(500).send("Server Error");
  }
}

async function handleDeleteCategory(req, res) {
  const categoryId = req.params.id;
  if (!categoryId) {
    return res.status(400).send("Category ID is required");
  }
  try {
    await deleteCategory(categoryId);
    return res.status(200).json({ redirect: "/" });
  } catch (err) {
    console.error("Can't delete category", err);
    res.status(500).send("Server Error");
  }
}
async function handleDeleteItem(req, res) {
  const itemId = req.params.id;

  try {
    const item = await getItemById(itemId);
    const category = item[0];
    const categoryId = category.item_category_id;
    await deleteItem(itemId);
    res.json({ redirect: `/category/${categoryId}` });
  } catch (err) {
    console.log(err, "can't delete item");
  }
}
async function handleItemEdit(req, res) {
  let errors = validationResult(req);
  console.log("edited");
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const itemId = req.params.id;

  const { itemName, itemDescription, itemPrice, itemImage } = req.body;

  try {
    const item = await getItemById(itemId);
    const categoryId = item[0].item_category_id;
    console.log(categoryId);
    await editItem(itemId, itemName, itemDescription, itemPrice, itemImage);
    return res.json({ redirect: `/category/${categoryId}` });
  } catch (err) {
    console.log(err, "can't edit item");
    return res.status(500).send("Server Error");
  }
}
async function handleAddItem(req, res) {
  const errors = validationResult(req);
  const categoryId = req.params.id;

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { itemName, itemDescription, itemPrice, itemImage } = req.body;

  try {
    await insertItem(
      itemName,
      itemDescription,
      itemPrice,
      itemImage,
      categoryId
    );
    return res.status(201).json({
      message: "Item added successfully!",
      redirect: `/category/${categoryId}`,
    });
  } catch (err) {
    console.error("Can't add new item", err);
    return res.status(500).send("Server Error");
  }
}
async function handleItemJson(req, res) {
  const itemId = req.params.id;
  try {
    const item = await getItemById(itemId);
    if (!item) {
      return res.status(404).send("Item not found");
    }
    return res.json(item[0]);
  } catch (err) {
    console.log(err, "can't respond with json");
    res.status(500).send("Server Error");
  }
}
async function handleUpdateCategory(req, res) {
  const { categoryName, categoryDescription } = req.body;
  const categoryId = req.params.id;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const category = await getCategory(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    await editCategory(categoryId, categoryName, categoryDescription);
    return res.status(200).json({
      redirect: `/category/${categoryId}`,
    });
  } catch (err) {
    console.log(err, "can't update category");
    return res.status(500).send("Server Error");
  }
}
async function handleCategoryJson(req, res) {
  const categoryID = req.params.id;
  try {
    const category = await getCategory(categoryID);
    if (!category) {
      res.send("Category not found");
    }
    return res.json(category[0]);
  } catch (err) {
    console.log(err, "error for category json");
    return res.status(500).send("server error");
  }
}
export {
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
};
