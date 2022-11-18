const Cart = require("../../models/cart");
const orderItemsService = require("../../models/services/orderItemsService");
const cartService = require("../../models/services/cartService");
const url = "/cart";

exports.postCartApi = async (req, res, next) => {
  const itemId = req.body.id;

  const userId = req.user;
  await cartService.removeProductFromCart(userId, itemId);
  const deletedItem = await orderItemsService.deleteItem(itemId);
  if (deletedItem) {
    await res.status(200).send(deletedItem);
  } else {
    for (let item of req.session.cart) {
      if (item.product._id.toString() == itemId) {
        let idx = req.session.cart.indexOf(item);
        const returnedItem = item;
        req.session.cart.splice(idx, 1);
        await res.status(200).send(returnedItem);
        break;
      }
    }
  }
};

exports.changeItemQuantity = async (req, res, next) => {
  const itemQuantity = req.body;
  if (req.user) {
    const item = await orderItemsService.changeItemQuantity(itemQuantity);
    await res.status(200).send(item);
  } else {
    for (let item of req.session.cart) {
      if (item.product._id.toString() == itemQuantity.id) {
        let idx = req.session.cart.indexOf(item);
        req.session.cart[idx].quantity = itemQuantity.quantity;
        await res.status(200).send(req.session.cart[idx]);
        break;
      }
    }
  }
};
