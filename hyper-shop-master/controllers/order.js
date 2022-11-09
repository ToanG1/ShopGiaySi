const ProductService = require('../models/services/productService'); // nhớ pass categories cho tất cả các view
const OrderService = require('../models/services/orderService');
const CartService = require('../models/services/cartService');
const OrderItemService = require('../models/services/orderItemsService');

exports.getOrder = async (req, res, next) => {
  const count = await OrderService.countOrders({ user: req.user._id });
  const lastPage = Math.ceil(count / 3);
  const orders = await OrderService.getOrders(req.user, req.query.page);
  res.status(200).render('shop/order', {
    currentPage: req.query.page || 1,
    lastPage,
    user: req.user,
    orders,
    categories: await ProductService.getCategoriesQuantity(),
    brands: await ProductService.getBrands(),
  });
};

exports.postOrder = async (req, res, next) => {
  const userInfor = {
    name: req.body.name,
    address: req.body.address,
    telephone: req.body.telephone,
  };

  let cart = await CartService.getCartByUserId(req.user);
  if(!cart){
    cart = await CartService.createNewCart(req.user);
  }
  if (cart.orderItems.length == 0) {
    res.status(304).send();
    return;
  }

  //const updatedCart = await CartService.updateIsOrderedItem(req.user);
  for(let i=0;i<cart.orderItems.length;i++){
    const updateItem = await OrderItemService.updateIsOrdered(cart.orderItems[i]);
  }
  const order = await OrderService.createOrder({
    user: req.user,
    orderItems: cart.orderItems,
    status: 'Pending',
    address: req.body.address,
    phone: req.body.phone,
    orderDate: new Date(),
  });

  cart.orderItems = [];
  cart.save();

  const orders = await OrderService.getOrders(req.user);

  res.redirect('/order');
};
