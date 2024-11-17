const { faker } = require('@faker-js/faker');
const Product = require('../src/models/Product');

const generateProducts = async (count) => {
  const products = [];

  for (let i = 0; i <= count; i++) {
    const product = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      stock: faker.helpers.rangeToNumber({ min: 0, max: 100 }),
      imageUrl: faker.image.url(),
      category: faker.commerce.department()
    };
    products.push(product);
  }

  return products;
};

// Insert generated products into MongoDB
const insertProducts = async () => {
  try {
    const products = await generateProducts(1000);

    const insertedProducts = await Product.insertMany(products);
    console.log(
      `${insertedProducts.length} products have been inserted into the products collection.`
    );
  } catch (error) {
    console.error('Error inserting products:', error);
  }
};

module.exports = insertProducts;
