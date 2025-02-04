import { getAllCategories, insertCategory } from "../db/queries.js";
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
  const allCategories = await getAllCategories();
  // console.log(allCategories);
  res.render("home", { title: "home", categories: allCategories });
}
async function getCategoryForm(req, res) {
  let errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty().length) {
    res.status(400).render("category-form", {
      title: "add Category",
      errors: errors.array(),
      value :req.body.categoryName
    });
  }
  // const { categoryName } = req.body;
  // console.log(categoryName);
  // res.redirect("/");
}
export { getHomePage, getCategoryForm ,validateUser};
