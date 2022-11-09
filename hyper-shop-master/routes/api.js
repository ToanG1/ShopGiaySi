const express = require("express");
const { checkAuthenticatedForApi } = require("../config/auth");

const router = express.Router();

const productsApiController = require("../controllers/apiController/products");


const commentsApiController = require("../controllers/apiController/comment");

const cartApiController = require("../controllers/apiController/cart");


const authApiController = require("../controllers/apiController/auth");

const orderApiController = require('../controllers/apiController/order');


router.get("/products", productsApiController.getProductsApi);
router.post("/cart", cartApiController.postCartApi);
router.post("/cart/change-quantity", cartApiController.changeItemQuantity);

router.post(
  "/comments/:productId([0-9a-fA-F]{24})",
  checkAuthenticatedForApi,
  commentsApiController.postComment
);

router.get(
  "/comments/:productId([0-9a-fA-F]{24})",
  commentsApiController.getComments
);

router.post("/login", authApiController.postLoginApi);

router.get('/order', orderApiController.getOrder);

module.exports = router;
