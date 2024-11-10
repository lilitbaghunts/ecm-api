const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    imageUrl: { type: String },
    category: { type: String }
  },
  { timeStamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
