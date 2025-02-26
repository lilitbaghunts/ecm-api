const errors = {
  USER_EXISTS: 'Email already registered.',
  INVALID_CREDENTIALS: 'Invalid credentials.',
  ACCESS_DENIED: 'Access denied.',
  USER_NOT_FOUND: 'User not found.',
  INVALID_TOKEN: 'Invalid token.',
  ADMIN_ONLY: 'Access denied, admin only.',
  PRODUCT_NAME_REQUIRED: 'Product name is required.',
  PRODUCT_PRICE_REQUIRED: 'Product price is required.',
  PRODUCT_NOT_FOUND: 'Product not found.'
};

const success = {
  USER_REGISTERED: 'User registered successfully.',
  PRODUCT_UPDATED: 'Product successfully updated.',
  PRODUCT_DELETED: 'Product successfully deleted.'
};

module.exports = {
  errors,
  success
};
