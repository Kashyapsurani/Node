const Product = require("../models/productModel");

exports.getAllProducts = (req, res) => {
  res.render("products", { products: Product.getAll() });
};

exports.getProductById = (req, res) => {
  const product = Product.getById(req.params.id);
  if (product) {
    res.render("products", { products: [product] });
  } else {
    res.status(404).send("Product not found");
  }
};

exports.createProduct = (req, res) => {
  const newProduct = Product.create(req.body);
  res.status(201).json(newProduct);
};
