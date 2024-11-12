const Product = require('../models/Product');
const redisClient = require('../config/redis');

const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, category, minPrice, maxPrice } = req.query;

    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(filter).skip(skip).limit(Number(limit));
    const totalCount = await Product.countDocuments(filter);

    redisClient.setEx(req.cacheKey, 3600, JSON.stringify(products));

    res.status(200).json({
      products,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page),
      totalProducts: totalCount
    });
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
