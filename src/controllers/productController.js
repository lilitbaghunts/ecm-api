const Product = require('../models/Product');
const redisClient = require('../config/redis');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    // Cache the products
    await redisClient.setEx(req.cacheKey, 3600, JSON.stringify(products));

    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching products', error });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Error creating products', error });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching product', error });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Invalidate cached products
    await redisClient.del('products:all');

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Error updating products', error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Invalidate cached products
    await redisClient.del('products:all');

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error deleting product', error });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
