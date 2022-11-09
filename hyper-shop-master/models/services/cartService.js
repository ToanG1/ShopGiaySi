const Cart = require("../cart");
const orderItemsService = require("./orderItemsService");
const { ObjectId } = require("mongodb");

exports.checkOrderItemExistedInCart = async (product, size, cart) => {
  for (let item of cart.orderItems) {
    if (
      item.product._id.toString() == product._id.toString() &&
      item.size.toString() == size.toString()
    ) {
      const orderItem = await orderItemsService.findById(item);
      // orderItem.quantity += 1;
      // orderItem.save();
      return orderItem;
    }
  }
};

exports.addProductToCart = async (user, products) => {
  const userId = user._id;
  //tìm cart theo user id
  let cart = await Cart.findOne({ user: userId }).populate({
    path: "orderItems",
    model: "OrderItem",
    populate: {
      path: "product",
      model: "Product",
    },
  });

  const orderItems = [];

  for (let prod of products) {
    //tạo orderItems từ các product trong cart ảo
    const item = await orderItemsService.createNewItem({
      product: prod.product._id,
      quantity: 1,
      size: prod.size,
      isOrdered: false,
    });
    orderItems.push(item._id);
  }

  if (!cart) {
    //nếu cart trong db chưa tồn tại thì tạo cart mới
    await Cart.create({
      user: ObjectId(userId),
      orderItems: orderItems,
    });
  } else {
    for (let item of orderItems) {
      cart.orderItems.push(item);
    }
    await cart.save();
  }

  return Cart.findOne({ user: userId }).populate({
    path: "orderItems",
    model: "OrderItem",
    populate: {
      path: "product",
      model: "Product",
    },
  });
};

exports.addSingleProductToCart = async (product, size, cart) => {
  const orderItem = await this.checkOrderItemExistedInCart(product, size, cart);
  if (!orderItem) {
    const item = await orderItemsService.createNewItem({
      product: product._id,
      quantity: 1,
      size: size,
      isOrdered: false,
    });
    cart.orderItems.push(item._id);
    cart.save();
  } else {
    orderItem.quantity = orderItem.quantity + 1;
    orderItem.save();
  }
};

exports.removeProductFromCart = async (user, itemId) => {
  const cart = await Cart.findOne({ user: user });
  if (cart) {
    for (let item of cart.orderItems) {
      if (item.toString() == itemId) {
        if (cart.orderItems.remove(item)) {
          await cart.save();
        }
      }
    }
  }
};

exports.getCartByUserId = (user) => {
  const userId = user._id;
  return Cart.findOne({ user: userId }).populate({
    path: "orderItems",
    model: "OrderItem",
    populate: {
      path: "product",
      model: "Product",
    },
  });
};

exports.createNewCart = async (userId) => {
  const newCart = await Cart.create({
    user: userId,
    orderItems: [],
  });
  return newCart;
};

exports.updateIsOrderedItem = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "orderItems",
    model: "OrderItem",
    populate: {
      path: "product",
      model: "Product",
    },
  });
  for (let i = 0; i < cart.orderItems.length; i++) {
    cart.orderItems[i].isOrdered = true;
  }
  cart.save();
  return cart;
};
