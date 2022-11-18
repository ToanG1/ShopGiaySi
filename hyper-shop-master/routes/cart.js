const express = require('express');

const router = express.Router();
const cartController = require('../controllers/cart');
const {checkAuthenticated, checkNotAuthenticated} = require('../config/auth');

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.get('/checkout', checkAuthenticated, cartController.getCheckout);

module.exports = router;
