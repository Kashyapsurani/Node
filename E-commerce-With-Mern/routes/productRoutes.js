const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getMyProducts,
  showProductForm,
  createProduct,
  editProductForm,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { requireAuth } = require("../middleware/authMiddleware");

router.get("/", getAllProducts);
router.get("/my", requireAuth, getMyProducts);

router.get("/add", requireAuth, showProductForm);
router.post("/add", requireAuth, createProduct);

router.get("/new", requireAuth, showProductForm); // Show the form to add a new product
router.post("/new", requireAuth, createProduct);   // Handle the form submission
 
// Display the form to add a new product
router.get("/add", requireAuth, showProductForm);

// Handle product creation (POST)
router.post("/add", requireAuth, createProduct);

router.get("/edit/:id", requireAuth, editProductForm);
router.post("/edit/:id", requireAuth, updateProduct);

router.post("/delete/:id", requireAuth, deleteProduct);

module.exports = router;
