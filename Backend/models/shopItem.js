const mongoose = require('mongoose');

const shopItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String }, // base64 or URL
  stock: { type: Number, default: 0 },
});

module.exports = mongoose.model('ShopItem', shopItemSchema);
