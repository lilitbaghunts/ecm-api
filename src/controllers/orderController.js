const Order = require('../models/Order');

const createOrder = async (req, res) => {
  try {
    const order = await new Order({
      userId: req.user.userId,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Error creating order', error });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).populate(
      'items.productId'
    );
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching orders', error });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'items.productId'
    );
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching order', error });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
};
