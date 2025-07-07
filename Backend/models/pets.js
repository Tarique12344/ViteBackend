// models/Pet.js
const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // dog, cat, etc.
  breed: { type: String },
  age: { type: Number },
  description: { type: String },
  image: { type: String }, // image URL
  likes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Pet', petSchema);
