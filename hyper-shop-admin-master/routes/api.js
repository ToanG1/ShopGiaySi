const express = require("express");

const router = express.Router();
const productsApiController = require("../controllers/apiController/products");
const responseApiController = require("../controllers/apiController/response");
const usersApiController = require("../controllers/apiController/users");
const ordersApiController = require("../controllers/apiController/orders");
const authApiController = require("../controllers/apiController/auth");

router.get("/products", productsApiController.getProductsApi);
router.post("/response/:commentId", responseApiController.postResponse);

router.get("/users", usersApiController.getUsersApi);
router.post("/users", usersApiController.postActionUser);

router.post("/order/change-status", ordersApiController.postOrderStatus);

router.post("/login", authApiController.postLoginApi);

module.exports = router;
