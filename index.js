// loadd env to rpcess
require('dotenv').config()
const Razorpay = require('razorpay');

const express =require('express')

const cors= require('cors')

const router = require('./routes/router')

require('./db/connection')



const server= express()




server.use(cors())
server.use(express.json())
server.use(router)






const PORT = process.env.PORT || 3000

server.listen(PORT,()=>{
    console.log(`server started at ${PORT}`);
    
})

