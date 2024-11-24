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
  { timestamps: true }
);

ProductSchema.index({ name: 1, category: 1, price: 1 });

ProductSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
