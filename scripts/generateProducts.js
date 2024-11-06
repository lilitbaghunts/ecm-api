const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Product = require('../src/models/Product');
const User = require('../src/models/User');
const connectDB = require('../src/config/db');
const MONGO_URI = 'mongodb://localhost:27017/emc';

connectDB(MONGO_URI);

async function generateProducts(count) {
  // Fetch all user IDs
  const userIds = await User.distinct('_id');

  // Check if userIds array has data
  if (userIds.length === 0) {
    console.log('No users found in the database.');
    return;
  }

  const products = [];

  for (let i = 0; i <= count; i++) {
    const product = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      stock: faker.helpers.rangeToNumber({ min: 0, max: 100 }),
      imageUrl: faker.image.url(),
      category: faker.commerce.department(),
      userId: userIds[Math.floor(Math.random() * userIds.length)],
    };
    products.push(product);
  }

  return products;
}

// Insert generated products into MongoDB
async function insertProducts() {
  try {
    const products = await generateProducts(1300);
    const insertedProducts = await Product.insertMany(products);
    console.log(
      `${insertedProducts.length} products have been inserted into the products collection.`
    );
  } catch (error) {
    console.error('Error inserting products:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the insertion function
insertProducts();
