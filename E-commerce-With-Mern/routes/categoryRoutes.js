const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { requireAuth, checkRole } = require("../middleware/authMiddleware");

router.get("/categories", categoryController.getAllCategories);
router.get(
  "/categories/add",
  requireAuth,
  checkRole("admin"),
  categoryController.showCategoryForm
);
router.post(
  "/categories/add",
  requireAuth,
  checkRole("admin"),
  categoryController.addCategory
);

router.get(
  "/categories/edit/:id",
  requireAuth,
  checkRole("admin"),
  categoryController.editCategoryForm
);
router.post(
  "/categories/edit/:id",
  requireAuth,
  checkRole("admin"),
  categoryController.updateCategory
);

router.post(
  "/categories/delete/:id",
  requireAuth,
  checkRole("admin"),
  categoryController.deleteCategory
);

module.exports = router;
