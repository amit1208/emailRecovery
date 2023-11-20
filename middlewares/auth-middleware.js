import jwt from "jsonwebtoken";

import UserModel from "../models/User.js";

var checkUserAuth=async(req,res,next)=>{
  let token;
  const {authorization} = req.headers
  if(authorization && authorization.startsWith('Bearer')){

    try {
      // Get Token from header
        token =authorization.split(" ")[1]
        
        //verify Token
        const {userId} = jwt.verify(token,jwtsecretkey)
        console.log(userId)

        // get User from Token
        req.user = await UserModel.findById(userId).select('-password')
        next();
        
    } catch (error) {
      res.status(401).send({"status":"failed","message":"unauthorized User"})
      
    }
  }
  if(!token){
    res.status(401).send({"status":"failed","message":"unauthorized User,No token"})

  }
}
export default checkUserAuth ;


