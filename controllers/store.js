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

async function getHomePage(req, res) {
  const errors = validationResult(req);
  try {
    const allCategories = await getAllCategories();
    const categoriesWithItemCounts = await Promise.all(
      allCategories.map(async (category) => {
        const itemCount = await getTotalNumberOfItems(category.category_id);
        return { ...category, itemCount: itemCount[0] };
      })
    );

    res.render("home", {
      title: "Home",
      categories: categoriesWithItemCounts,
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
  let errors = validationResult(req);

  const categoryId = req.params.id;

  console.log(categoryId);
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
      errors: errors.array(),
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
    res.redirect("/");
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

    res.redirect(`/category/${category.item_category_id}`);
  } catch (err) {
    console.log(err);
  }
}
async function handleItemEdit(req, res) {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const itemId = req.params.id;
  const categoryId = req.query.category;
  const { itemName, itemDescription, itemPrice, itemImage } = req.body;

  try {
    await editItem(itemId, itemName, itemDescription, itemPrice, itemImage);
    res.redirect(`/category/${categoryId}`);
  } catch (err) {
    console.log(err, "can't edit item");
    res.status(500).send("Server Error");
  }
}
async function handleAddItem(req, res, categoryId) {
  if (req.body && categoryId) {
    const { itemName, itemDescription, itemPrice, itemImage } = req.body;
    console.log(itemName);
    try {
      await insertItem(
        itemName,
        itemDescription,
        itemPrice,
        itemImage,
        categoryId
      );

      res.redirect(`/category/${categoryId}`);
    } catch (err) {
      console.log(err, "can't add new item");
    }
  }
}
async function handleItemJson(req, res) {
  const itemId = req.params.id;
  try {
    const item = await getItemById(itemId);
    if (!item) {
      return res.status(404).send("Item not found");
    }
    res.json(item[0]);
  } catch (err) {
    console.log(err, "can't respond with json");
    res.status(500).send("Server Error");
  }
}
async function handleUpdateCategory(req, res, category) {
  console.log(category);
  console.log(req.body);
  const { categoryName, categoryDescription } = req.body;
  if (!req.body) return;
  try {
    await editCategory(category, categoryName, categoryDescription);
  } catch (err) {
    console.log(err, "can't update category");
  } finally {
    res.redirect(`/category/${category}`);
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
};
