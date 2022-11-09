const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  totalPrice: Number,
  isOrdered: Boolean, // false: trong gio hang; true: trong don hang -> khong bi nham lan neu sau nay tinh doanh thu
});

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItem;