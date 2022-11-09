const express = require("express");

const OrderController = require("../controllers/order");

const router = express.Router();

router.get("/", OrderController.getOrders);
router.get("/:orderId", OrderController.getOrder);

module.exports = router;
