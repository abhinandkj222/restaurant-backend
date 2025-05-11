const items= require('../models/itemSchema')

exports.addItem = async (req,res)=>{
     try{
        const {itemName,itemCategory,itemPrice,itemDescription,imageUrl}=req.body
        const newitem = await items.insertOne({itemName,itemCategory,itemPrice,itemDescription,imageUrl})
        res.status(200).json(newitem)
     }
     catch(error){
        res.status(401).json(error)
     }
}

exports.getitemAdmin = async (req,res)=>{
   try{
      const allitems= await items.find({})
      const count = await items.countDocuments()
      res.status(200).json({allitems,count})
   }
   catch(error){
      res.status(401).json(error)
   }
}


exports.getitemUser = async (req,res)=>{
   try{
      const allitems= await items.find({})
      res.status(200).json(allitems)
   }
   catch(error){
      res.status(401).json(error)
   }
}