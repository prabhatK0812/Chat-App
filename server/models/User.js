// importing mongoose
import mongoose from "mongoose";

// creating user schema (in schema constructor) :
const userSchema = new mongoose.Schema(
  
{ 
  // 1st object => for defining properties that will be available in user data :
  email:{type: String, required: true, unique: true},
  fullName:{type: String, required: true},
  password:{type: String, required: true, minlength:6},
  profilePic:{type: String, default: ""}, // for url of profile pic
  bio:{type: String},
}, 

// 2nd object => for timestamps
{timestamps:true} // it will automatically add the data when the user is created with date & time

);

const User = mongoose.model("User",userSchema);

// now we have created the user model now export this

export default User;

// Now using this user model we can store the data in mogodb datbase