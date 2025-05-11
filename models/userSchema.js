const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  cart: [
    {
      items: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'items'
      },
      quantity: {
        type: Number,
        default: 1
      },
      totalPrice:{
        type:Number,
        default: 0
      }
      

    }
  ],
  cartTotalAmount: {
    type: Number,
    default: 0
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'items'
    }
  ],
  
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  },
  resetToken: String,
  resetTokenExpiration: Date
});

const users=mongoose.model('users', userSchema);
module.exports =users 