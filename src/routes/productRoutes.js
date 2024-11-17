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

const router = express.Router();

router.get('/', cacheMiddleware('products'), getAllProducts);
router.post(
  '/',
  auth,
  cacheInvalidationMiddleware('products:*'),
  createProduct
);
router.get('/:id', getProductById);
router.put(
  '/:id',
  auth,
  cacheInvalidationMiddleware('products:*'),
  updateProduct
);
router.delete(
  '/:id',
  auth,
  cacheInvalidationMiddleware('products:*'),
  deleteProduct
);

module.exports = router;
