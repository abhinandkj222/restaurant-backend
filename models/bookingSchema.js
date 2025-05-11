const mongoose = require('mongoose');


const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },

  items: [
    {
      items: { type: mongoose.Schema.Types.ObjectId, ref: 'items' },
      quantity: Number
    }
  ],


  addressDetails: {   // 👈 NEW field (for storing form info)
    name: { type: String },
    address: { type: String },
    pincode: { type: String },
    dateTime: { type: Date }
  },

  totalAmount: { type: Number }, // 👈 NEW field (total price)

  status: { type: String, default: 'pending' }, // 'pending', 'assigned', 'completed'

  payment: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
    status: { type: String, default: 'pending' }, // 'pending', 'paid'
    paidAt: Date
  },

  createdAt: { type: Date, default: Date.now }
});
const Booking= mongoose.model('Booking', bookingSchema);
module.exports =Booking
