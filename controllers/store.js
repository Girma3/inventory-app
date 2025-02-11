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
} from "../db/queries.js";
import { body, validationResult } from "express-validator";
let lengthErr = "must be between 3 and 40 characters";
let validateUser = [
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
insertCategory("Strength Equipment");
async function getHomePage(req, res) {
  try {
    const allCategories = await getAllCategories();
    // const totalItemCount = await getTotalNumberOfItems(categoryId);
    let totalItemCount = [];
    const categoriesWithItemCounts = await Promise.all(
      allCategories.map(async (category) => {
        const itemCount = await getTotalNumberOfItems(category.category_id);
        totalItemCount.push(itemCount[0]);
        return { ...category, itemCount };
      })
    );
    // console.log(totalItemCount);
    // console.log(categoriesWithItemCounts);
    res.render("home", {
      title: "home",
      categories: allCategories,
      totalItems: totalItemCount,
      errors: [],
      category: null,
    });
  } catch (err) {
    console.log("can't get category data", err);
    res.status(500).send("Server Error");
  }
}
async function getCategoryForm(req, res) {
  let errors = validationResult(req);

  console.log(req.body);
  if (!errors.isEmpty()) {
    console.log(errors);
    res.status(400).render("category-form", {
      title: "add Category",
      errors: errors.array(),
      value: req.body.categoryName,
    });
  }
  const { categoryName, categoryDescription } = req.body;
  try {
    await insertCategory(categoryName, categoryDescription);
  } catch (err) {
    console.log(err, "can't create category");
  } finally {
    res.redirect("/");
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

async function handleDeleteCategory(categoryId) {
  console.log(categoryId);
  try {
    await deleteCategory(categoryId);
    res.redirect("/");
  } catch (err) {
    console.log("can't Delete category", err);
    res.status(500).send("Server Error");
  }
}
async function handleDeleteItem(req, res) {
  const itemId = req.params.id;
  console.log(itemId);
  try {
    await deleteItem(itemId);
  } catch (err) {
    console.log(err);
  }
}
async function handleItemEdit(req, res) {
  let errors = validationResult(req);

  //res.status(200).json(selectedItem[0]);

  try {
    const itemId = req.params.id;
    let categoryId = 1;

    const selectedItem = await getItemById(itemId);

    const selectedCategory = await getCategory(
      selectedItem[0].item_category_id
    );
    categoryId = selectedCategory[0].category_id;

    // const selectedCategoryItems = await getAllItems(categoryId);
    // const categoryName = selectedCategory[0].category_name;
    res.status(200).json(selectedItem[0]);
  } catch (err) {
    console.log(err);
  }
}
async function handleAddItem(req, res, categoryId) {
  console.log(categoryId);
  console.log(req.body);
  if (req.body) {
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
  validateUser,
  getDetailPage,
  handleDeleteCategory,
  handleItemEdit,
  handleDeleteItem,
  handleAddItem,
  handleUpdateCategory,
};
