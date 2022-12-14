const OrderItem = require("../orderItem");
const { ObjectId } = require("mongodb");

exports.createNewItem = async (orderItem) => {
  const item = await OrderItem.create(orderItem);
  return item;
};

exports.findById = async (itemId) => {
  const item = await OrderItem.findOne({ _id: itemId });
  return item;
};

exports.changeItemQuantity = async (itemQuantity) => {
  const item = await OrderItem.findById(itemQuantity.id).populate({
    path: "product",
    model: "Product",
  });
  let sizes = item.product.countInStock;
  for (size of sizes) {
    if (size.size == item.size && size.quantity - itemQuantity.quantity >= 0) {
      item.quantity = itemQuantity.quantity;
      item.save();
    } else if (
      size.size == item.size &&
      size.quantity - itemQuantity.quantity < 0
    ) {
      item.quantity = size.quantity;
      item.save();
    }
  }
  return item;
};

exports.deleteItem = async (itemId) => {
  const deletedItem = await OrderItem.findOneAndRemove({
    _id: ObjectId(itemId),
  }).populate({
    path: "product",
    model: "Product",
  });
  return deletedItem;
};

exports.updateIsOrdered = async (itemId) => {
  const item = await OrderItem.findOne({ _id: itemId });
  item.isOrdered = true;
  item.save();
  return item;
};
