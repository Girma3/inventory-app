import {
  getAllCategories,
  getAllItems,
  getCategory,
  getTotalNumberOfItems,
  insertCategory,
} from "../db/queries.js";
import { body, validationResult } from "express-validator";
let lengthErr = "must be between 3 and 20 characters";
let validateUser = [
  body("categoryName")
    .trim()
    .isEmpty()
    .withMessage("Name can't be empty!")
    .isLength({ min: 3, max: 20 })
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
    console.log(totalItemCount);
    console.log(categoriesWithItemCounts);
    res.render("home", {
      title: "home",
      categories: allCategories,
      totalItems: totalItemCount,
    });
  } catch (err) {
    console.log("can't get category data", err);
    res.status(500).send("Server Error");
  }
}
async function getCategoryForm(req, res) {
  let errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty().length) {
    res.status(400).render("category-form", {
      title: "add Category",
      errors: errors.array(),
      value: req.body.categoryName,
    });
  }
  // const { categoryName } = req.body;
  // console.log(categoryName);
  // res.redirect("/");
}
async function getDetailPage(req, res) {
  const categoryId = req.params.id;
  try {
    const selectedCategory = await getCategory(categoryId);
    if (!selectedCategory.length) {
      return res.status(404).send("Category not found");
    }
    const selectedCategoryItems = await getAllItems(categoryId);
    const categoryName = selectedCategory[0].category_name;
    res.render("detail-page", {
      title: categoryName,
      categoryName: categoryName,
      categoryId: categoryId,
      items: selectedCategoryItems,
    });
  } catch (err) {
    console.error("Error getting detail page", err);
    res.status(500).send("Server Error");
  }
}
export { getHomePage, getCategoryForm, validateUser, getDetailPage };
