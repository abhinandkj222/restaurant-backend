// Router specfic middleware
// import jsonwebtoken
const jwt =require('jsonwebtoken')
// define logic for checking user loginned or not

const logMiddleware =(req,res,next)=>{
    console.log("Router specific middleawre");
    // get token
    const token =req.headers['access-token']  
    try{
        // verify token
     
    console.log(jwt.verify(token,"secret12345"));
    
    const {loginUserEmail}=jwt.verify(token,"secret12345")
    console.log(loginUserEmail);
    req.loginUserEmail=loginUserEmail
    
    // pass loginAcno to req

    
    // to process user request
    next()
    }
    catch{
      res.status(401).json("please login")
    }
    
    
    
}
module.exports ={
    logMiddleware
}