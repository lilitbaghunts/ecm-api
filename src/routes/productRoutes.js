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

router.get('/', cacheMiddleware('products:all'), getAllProducts);
router.post(
  '/',
  auth,
  cacheInvalidationMiddleware(['products:all']),
  createProduct
);
router.get('/:id', getProductById);
router.put(
  '/:id',
  auth,
  cacheInvalidationMiddleware(['products:all']),
  updateProduct
);
router.delete(
  '/:id',
  auth,
  cacheInvalidationMiddleware(['products:all']),
  deleteProduct
);

module.exports = router;
