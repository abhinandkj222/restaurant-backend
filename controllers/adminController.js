const admins = require('../models/adminSchema')
const users =require('../models/userSchema')
const jwt =require('jsonwebtoken')
const items =require('../models/itemSchema')
const Booking =require('../models/bookingSchema')



exports.adminRegister = async (req,res)=>{
   
    try{
      const existingAdmin = await admins.findOne({});
      if (existingAdmin) {
          return res.status(403).json({ message: 'Admin already exists. Registration not allowed.' });
      }

      const { name,lastname,email,password } = req.body;

      const newAdmin = new admins({
        name,
        email,
        lastname,
        password
      });

      await newAdmin.save();

      res.status(201).json( 'Admin registered successfully',newAdmin);
    }
  catch(error){
    res.status(401).json(error)
  }
}

exports.login = async (req,res)=>{
  const {email,password} =req.body
  try{
    const preadmin = await admins.findOne({email,password})
    if(preadmin){
       const token =jwt.sign({
        loginAdminEmail:email,
         role: "admin"
       },"secret12345")

       res.status(200).json({preadmin,token,role:"admin"})
    }
    const preuser = await users.findOne({email,password})
    if(preuser){
      const token =jwt.sign({
        loginUserEmail:email,
         role: "user"
      },"secret12345")
      res.status(200).json({preuser,token,role:"user"})
    }
    res.status(406).json("invalid email or password")
  }
  catch(error){
     res.status(401).json(error)
  }
}

exports.getOrders= async (req,res)=>{
  try{
   const booking = await Booking.find().populate("items.items").populate("user")
   res.status(200).json(booking)
  }
  catch(error){
   res.status(401).json(error)  }
}

exports.deletItemByadmin = async (req,res)=>{
  const {itemName}=req.body
  try{
     const ditem = await items.deleteOne({itemName})
     res.status(200).json("item deleted")
  }
  catch(error){
    res.status(401).json(error)
  }
}


exports.getUserCount = async (req,res)=>{
  try{
    const count =await users.countDocuments()
    res.status(200).json(count)
  }
  catch(error){
    res.status(401).json(error)
  }
}

exports.getBookingCount =async (req,res)=>{
   try{
    const bookingCount = await Booking.countDocuments()
    res.status(200).json(bookingCount)
   }
   catch(error){
    res.status(401).json(error)
   }
}