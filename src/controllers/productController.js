const Product = require('../models/Product');
const redisClient = require('../config/redis');
const { errors } = require('../common/messages');

const getAllProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 50,
      name,
      category,
      minPrice,
      maxPrice
    } = req.query;

    const filter = {};
    if (name) {
      filter.$text = { $search: name };
    }
    if (category) {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const skip = (page - 1) * limit;
    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ name: 1, category: 1, price: 1 }),
      Product.countDocuments(filter)
    ]);

    const productData = {
      products,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page),
      totalProducts: totalCount
    };

    redisClient.setEx(req.cacheKey, 3600, JSON.stringify(productData));

    res.status(200).json(productData);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, price } = req.body;
    if (!name) {
      return res.status(400).json({ message: errors.PRODUCT_NAME_REQUIRED });
    }
    if (!price) {
      return res.status(400).json({ message: errors.PRODUCT_PRICE_REQUIRED });
    }
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
    if (!product)
      return res.status(404).json({ message: errors.PRODUCT_NOT_FOUND });
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true
    });
    if (!product)
      return res.status(404).json({ message: errors.PRODUCT_NOT_FOUND });

    res.status(200).json({ message: 'Product successfully updated.' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: errors.PRODUCT_NOT_FOUND });

    res.status(200).json({ message: 'Product successfully deleted.' });
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
