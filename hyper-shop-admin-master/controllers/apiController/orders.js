const OrderService = require("../../models/services/orderService");

exports.postOrderStatus = async (req, res, next)=>{
    const orderStatus = req.body;
    const order = await OrderService.updateStatusOrder(orderStatus);
    res.status(200).send(order);
}