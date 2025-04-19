const Product = require("../models/Product");
const Category = require("../models/Category");

exports.getAllProducts = async (req, res) => {
  const products = await Product.find().populate("category").populate("owner");
  res.render("productList", { products });
};

exports.getMyProducts = async (req, res) => {
  const products = await Product.find({ owner: req.user._id }).populate(
    "category"
  );
  res.render("myProducts", { products });
};

exports.showProductForm = async (req, res) => {
  const categories = await Category.find();
  res.render("productForm", { categories, product: null });
};

exports.createProduct = async (req, res) => {
  const { name, price, category } = req.body;
  await Product.create({ name, price, category, owner: req.user._id });
  res.redirect("/products/my");
};

exports.editProductForm = async (req, res) => {
  const product = await Product.findById(req.params.id);
  const categories = await Category.find();
  res.render("productForm", { product, categories });
};

exports.updateProduct = async (req, res) => {
  const { name, price, category } = req.body;
  await Product.findByIdAndUpdate(req.params.id, { name, price, category });
  res.redirect("/products/my");
};
 
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/products/my");
};
