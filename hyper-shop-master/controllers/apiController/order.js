const OrderService = require('../../models/services/orderService');

exports.getOrder = async (req, res, next) => {
  const count = await OrderService.countOrders({ user: req.user._id });
  const lastPage = Math.ceil(count / 3);
  const orders = await OrderService.getOrders(req.user, req.query.page);
  const result = {
    currentPage: req.query.page || 1,
    lastPage,
    orders,
  };
  res.status(200).send(result);
};
