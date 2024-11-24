const express = require('express');
const {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
const {
  cacheMiddleware,
  cacheInvalidationMiddleware
} = require('../middleware/cacheMiddleware');
const isAdmin = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', cacheMiddleware('products'), getAllProducts);
router.post(
  '/',
  auth,
  isAdmin,
  cacheInvalidationMiddleware('products:*'),
  createProduct
);
router.get('/:id', getProductById);
router.put(
  '/:id',
  auth,
  isAdmin,
  cacheInvalidationMiddleware('products:*'),
  updateProduct
);
router.delete(
  '/:id',
  auth,
  isAdmin,
  cacheInvalidationMiddleware('products:*'),
  deleteProduct
);

module.exports = router;
