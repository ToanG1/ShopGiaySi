const express = require("express");

const router = express.Router();
const productController = require("../controllers/product");

router.get("/", productController.getProducts);
router.get("/:productId([0-9a-fA-F]{24})", productController.getProductDetail);

module.exports = router;
