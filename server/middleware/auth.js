// #middleware is a function which is executed before executing a controller function

// Using this middleware we will protect our route => so that if user is authenticated then only it can access the particualr API end point

import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
  try{
    
    // first we will get token from headers => we will send the token from frontend in the headers of every APi req
    const token = req.headers.token;
    
    // decoding token to get user_id :
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // getting userdata with removed password
    const user =  await User.findById(decoded.userId).select("-password");

    // if user is not avaialble(not found) 
    if(!user) return res.json({success:false, message:"User not found"});

    // if user is available => add this user data in req
    req.user = user;
    // now we can access the user data in controller fun

    next(); // for executing next fun (controller fun)


  } catch (error) {

      console.log(error.message);
      res.json({success: false, message:error.message});
  }

}
