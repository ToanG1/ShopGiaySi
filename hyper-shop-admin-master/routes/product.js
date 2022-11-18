const express = require("express");

const productController = require("../controllers/product");
const path = require("path");

const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./img/",
  filename: function (req, file, callback) {
    callback(
      null,
      file.originalname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

let upload = multer({
  storage: storage,
}).single("image");

router.get("/", productController.getProducts);

router.get("/addProduct", productController.getAddProduct);

router.post("/addProduct", productController.postAddProduct);

router.get(
  "/editProduct/:productId([0-9a-fA-F]{24})",
  productController.getEditProduct
);

router.post("/editProduct", productController.postEditProduct);

router.post("/deleteProduct", productController.postDeleteProduct);

router.post("/deleteProduct", productController.postDeleteProduct);

router.get(
  "/import/:productId([0-9a-fA-F]{24})",
  productController.getImportToWarehouse
);

router.post("/import", productController.postImportToWarehouse);

router.get("/:productId([0-9a-fA-F]{24})", productController.getProductDetail);
//i
module.exports = router;
