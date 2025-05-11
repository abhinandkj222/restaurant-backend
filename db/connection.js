require('dotenv').config()

const mongoose =require('mongoose')

 const DB = process.env.DATABASE

mongoose.connect(DB,{
    useNewUrlparser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("mongodb connected successfully");
    
}).catch((error)=>{
    console.log("connecttion error",error);
    
})