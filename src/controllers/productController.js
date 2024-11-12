const Product = require('../models/Product');
const redisClient = require('../config/redis');
const cacheKey = 'products:all';

const getAllProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice } = req.query;

    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const products = await Product.find(filter);

    if (req.cacheKey) {
      await redisClient.setEx(req.cacheKey, 3600, JSON.stringify(products));
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Invalidate cached products
    await redisClient.del(cacheKey);

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Invalidate cached products
    await redisClient.del(cacheKey);

    res.status(204).send();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct
};
