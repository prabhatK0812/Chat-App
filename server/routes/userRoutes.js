import express from "express";
import { checkAuth, login, signup, updateProfile } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter  = express.Router();  // it will create new user router in(using) which we will create different end points


// API end points :
userRouter.post("/signup" ,signup);  // routes with controller function is passed
userRouter.post("/login" ,login);
userRouter.put("/update-profile", protectRoute, updateProfile);  // put method for updating data
userRouter.get("/check", protectRoute, checkAuth);

export default userRouter;

// Now we have created all 4 API end points => add this in server.js file