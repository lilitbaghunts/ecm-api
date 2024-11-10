const Order = require('../models/Order');

const createOrder = async (req, res, next) => {
  try {
    const order = await new Order({
      userId: req.user.userId,
      items: req.body.items,
      totalAmount: req.body.totalAmount
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).populate(
      'items.productId'
    );
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'items.productId'
    );
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById
};
