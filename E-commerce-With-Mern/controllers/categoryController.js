const Category = require("../models/Category");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("categoryList", { categories });
  } catch (err) {
    res.status(500).send("Error fetching categories");
  } 
};

exports.showCategoryForm = (req, res) => {
  res.render("categoryForm", { category: null });
};

exports.addCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send("Category name is required.");
  }
  await Category.create({ name });
  res.redirect("/categories");
};

exports.editCategoryForm = async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.render("categoryForm", { category });
};

exports.updateCategory = async (req, res) => {
  const { name } = req.body;
  await Category.findByIdAndUpdate(req.params.id, { name });
  res.redirect("/categories");
};

exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.redirect("/categories");
};
