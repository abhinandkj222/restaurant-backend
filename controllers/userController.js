const users = require('../models/userSchema')
const items = require('../models/itemSchema')
const Razorpay = require('razorpay');
const Booking =require('../models/bookingSchema')

const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config()


exports.userRegister = async (req,res)=>{
    try{
       const {name,lastname, email, password} =req.body
       const preuser = await users.findOne({email})
       if(preuser){
        res.status(406).json("user already exists")
       }
       else{
        const newuser = new users({
           name,
           lastname,
           email,
           password 
        })
        await newuser.save()
        res.status(200).json(newuser,"user registered successfully")
       }
    }
    catch(error){
        res.statis(401).json(error)
    }
}






exports.addTocart = async (req, res) => {
  const { itemName } = req.body;
  const email = req.loginUserEmail;

  try {
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json("User not found");
    }

    const item = await items.findOne({ itemName });
    if (!item) {
      return res.status(404).json("Item not found");
    }

    // Check if item is already in the user's cart (by comparing ObjectId)
    const existingItem = user.cart.find(cartItem => cartItem.items.toString() === item._id.toString());

    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.totalPrice = item.itemPrice * existingItem.quantity;
    } else {
     user.cart.push({ items: item._id, quantity: 1 ,totalPrice: item.itemPrice });
    }
    
    // Recalculate the overall cart total amount
    let totalAmount = 0;
    for (let cartItem of user.cart) {
      totalAmount += cartItem.totalPrice; // Add the total price for each item to the overall cart total
    }

    // Update the overall cart total amount
    user.cartTotalAmount = totalAmount;

    
    
    await user.save();

    // Optional: populate cart with item details
    // await user.populate('cart.items');

    res.status(200).json({
      message: "Item added to cart successfully", cart:user.cart
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getUserCart = async (req,res) =>{
    const email = req.loginUserEmail;
    try{
    const user = await users.findOne({email}).populate('cart.items')
    res.status(200).json(user)
    
    }
    catch(error){
        res.status(401).json(error)
    }
}

exports.updateCartItem = async (req, res) => {
    const { itemId, quantity } = req.body;
    const email = req.loginUserEmail;
  
    try {
      const user = await users.findOne({ email });
      if (!user) return res.status(404).json("User not found");
  
      const item = await items.findById(itemId);
      if (!item) return res.status(404).json("Item not found");
  
      const cartItem = user.cart.find(ci => ci.items.toString() === itemId);
      if (!cartItem) return res.status(404).json("Item not in cart");
  
      cartItem.quantity = quantity;
      cartItem.totalPrice = item.itemPrice * quantity;
  
      // Update overall cart total
      user.cartTotalAmount = user.cart.reduce((acc, ci) => acc + ci.totalPrice, 0);
  
      await user.save();
      await user.populate('cart.items');
  
      res.status(200).json({
        message: "Cart updated",
        cart: user.cart,
        cartTotalAmount: user.cartTotalAmount
      });
    } catch (error) {
      console.error("Update quantity error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };



exports.removeCartItem = async (req, res) => {
  const { itemId } = req.body; // <-- receiving the cart item id from frontend
  const email = req.loginUserEmail; // <-- you are fetching user email from middleware

  try {
    const user = await users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    
    // Remove the item from user's cart by matching the _id inside cart
    user.cart = user.cart.filter(cartItem => cartItem._id.toString() !== itemId);
    
    
    
    // Update cart total after removal (optional, but good practice)
    user.cartTotalAmount = user.cart.reduce((total, item) => total + item.totalPrice, 0);

    await user.save();

    res.status(200).json({ message: 'Item removed from cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove item from cart', error: error.message });
  }
};


// addtowishlsit
exports.addToWishlist = async (req, res) => {
  const email = req.loginUserEmail;
  const { itemName } = req.body;

  try {
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const item = await items.findOne({ itemName });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const alreadyExists = user.wishlist.some(
      wishItem => wishItem.toString() === item._id.toString()
    );

    if (alreadyExists) {
      return res.status(409).json({ message: "Item already exists in the wishlist" });
    }

    user.wishlist.push(item._id);
    await user.save();

    res.status(200).json({ message: "Item added to wishlist", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// get wishlist
exports.getUserWishlist = async (req,res) =>{
  const email = req.loginUserEmail;
  try{
  const user = await users.findOne({email}).populate('wishlist')
  res.status(200).json(user)
  
  }
  catch(error){
      res.status(401).json(error)
  }
}


exports.removeWishlistItem = async (req,res)=>{
  const email = req.loginUserEmail
  const {itemId} =req.body

  try{
    const user =await users.findOne({email})
    if(!user){
      return res.status(406).json("user not found")
    }
    user.wishlist = user.wishlist.filter(wi => wi._id.toString() !== itemId);
     await user.save()
     res.status(201).json({wishlist:user.wishlist})
  }
  catch(error){
    res.status(500).json(error)
    
  }
}


exports.createBooking = async (req,res) =>{
  try {
    const email = req.loginUserEmail // Get from your middleware
    const user = await users.findOne({ email });

    if (!user) return res.status(404).send('User not found');

    const { items, addressDetails, totalAmount } = req.body;

    const newBooking = new Booking({
      user: user._id,
      items,
      addressDetails,
      totalAmount,
      status: 'pending'
    });

    const savedBooking = await newBooking.save();

    res.json({ booking: savedBooking });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).send('Error creating booking');
  }
}

const razorpay = new Razorpay({
  key_id: 'rzp_test_ZMQylZyXtVsMsc',
  key_secret: 'scgwtFn9JvfMC6vQv3k5WRRA'
});
exports.createOrder = async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // paise
    currency: "INR",
    receipt: "receipt_order_" + Date.now()
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating Razorpay order');
  }
};


exports.successpayment = async (req,res)=>{
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).send('Booking not found');
    }

    booking.payment = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      status: 'paid',
      paidAt: new Date()
    };

    booking.status = 'assigned'; // Mark as assigned after payment

    await booking.save();

    res.send({ message: 'Payment saved successfully, booking updated!' });
  } catch (err) {
    console.error('Error saving payment:', err);
    res.status(500).send('Error saving payment');
  }
}

exports.getBookingDetails =async (req,res)=>{
  const email = req.loginUserEmail
  try{
     const user = await users.findOne({email})
     const userId = user._id
     const booking = await Booking.find({user:userId}).populate("items.items")
   res.status(200).json(booking)
  }
  catch(error){
    res.status(401).json(error)
  }
}



exports.clearCart =async (req,res)=>{
  try{
    const email = req.loginUserEmail
    const user = await users.findOne({email})
    if(!user){
      return res.status(404).json("usernot found")
    }
    // clear cart
    user.cart =[]
    user.cartTotalAmount=0

    await user.save()
    res.status(200).json("cart cleaered succesfully")
  }
  catch(error){
    res.status(401).json(error)
  }
}

exports.deleteOrder = async (req,res)=>{
  try {
    const {orderId} =req.body
    const order = await Booking.deleteOne({_id:orderId})
    res.status(200).json("deleted")
  }
  catch(error){
    res.status(401).json(error)
  }
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(32).toString('hex');

  try {
    const user = await users.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset',
      html: `
    <p>Click the button below to reset your password:</p>
    <a href="http://localhost:4200/reset-password/${token}" 
       style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">
      Reset Password
    </a>
    <p>If the button doesn’t work, copy and paste this link into your browser:</p>
    <p>http://localhost:4200/reset-password/${token}</p>
  `
    });

    res.json({ message: 'Reset link sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await users.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Token expired or invalid' });

    user.password = newPassword; // hash if needed
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};