const { faker } = require('@faker-js/faker');
const Order = require('../src/models/Order');
const Product = require('../src/models/Product');
const User = require('../src/models/User');

const generateOrders = async (count) => {
  // Fetch all user IDs

  const userIds = await User.distinct('_id');
  const products = await Product.find();
  const productIds = products.map((p) => p._id);

  if (userIds.length === 0 || productIds.length === 0) {
    console.log('No users or products found in the database.');
    return;
  }

  const orders = [];

  for (let i = 0; i <= count; i++) {
    const orderItems = [];
    const numItemsInOrder = faker.number.int({ min: 1, max: 5 });
    let totalAmount = 0;

    for (let j = 0; j <= numItemsInOrder; j++) {
      const productId =
        productIds[Math.floor(Math.random() * productIds.length)];
      const product = products.find(
        (p) => p._id.toString() === productId.toString()
      );

      if (product) {
        const quantity = faker.helpers.rangeToNumber({ min: 0, max: 5 });
        const unitPrice = product.price;

        orderItems.push({
          productId,
          quantity,
          unitPrice
        });

        totalAmount += unitPrice * quantity;
      }
    }

    const order = {
      userId: userIds[Math.floor(Math.random() * userIds.length)],
      totalAmount,
      items: orderItems,
      status: 'pending'
    };
    orders.push(order);
  }

  return orders;
};

// Insert generated orders into MongoDB
const insertOrders = async () => {
  try {
    const orders = await generateOrders(100);
    const insertedOrders = await Order.insertMany(orders);
    console.log(
      `${insertedOrders.length} orders have been inserted into the orders collection.`
    );
  } catch (error) {
    console.error('Error inserting orders:', error);
  }
};

module.exports = insertOrders;
