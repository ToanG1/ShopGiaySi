const Order = require('../order');
const OrderItem = require('../orderItem');
// const Order = require('../order');

//input: user id, product id
//work with order, order item
//output: true false
exports.isBoughtProduct = async (userId, productId) => {
  let res = 0;
  const data = await Order.find({ user: userId })
    .populate('user')
    .populate('orderItems');
  data.forEach(order => {
    order.orderItems.forEach(item => {
      if (item.product == productId) {
        res++;
      }
    });
  });
  return res > 0 ? true : false;
};

exports.createOrder = properties => {
  return Order.create(properties);
};
exports.countOrders = filters => {
  return Order.count(filters);
};
exports.getOrders = (userId, currentPage = 1) => {
  return Order.find({ user: userId })
    .populate({
      path: 'orderItems',
      model: 'OrderItem',
      populate: {
        path: 'product',
        model: 'Product',
      },
    })
    .sort('-orderedDate')
    .limit(3)
    .skip(3 * (currentPage - 1));
};
