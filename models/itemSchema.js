const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true
  },
  itemCategory: {
    type: String,
    required: true
  },
  itemPrice: {
    type: Number,
    required: true
  },
  itemDescription: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String, // store the image path or URL
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const items=mongoose.model('items', itemSchema);
module.exports = items