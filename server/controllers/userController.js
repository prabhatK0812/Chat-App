import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Signup a new user

// user signup function(async) :
export const signup = async(req,res) => {

  // first we will get these details by destructuring the data : 
  const {fullName,email,password,bio} = req.body;  // from req body(frontend-user) we will get this data


  try{

    // 1st we will check whether these data are available or not :

    if (!fullName || !email || !password || !bio){ // if any of these data will be missing 
      return res.json({success:false, message:"Missing Details"})
    }

    // if all data is available we will create the user before this

    // Before creating user => we will check if any user is avialable for this emial or not
    const user = await User.findOne({email}); // using user model -> to check(find) email

    if(user){ // if user is found with the email
      return res.json({success:false, message:"Account already exists"})
    }

    // if there is no user with particular email we will gnerate encrypted password:

    // for generating encrypted password :
    const salt = await bcrypt.genSalt(10);
    // using salt to encrypt the passsword:
    const hashedPassword = await bcrypt.hash(password, salt);

    // now we have hased password which we will store in databse

    // creating new user in mongodb databse:
    const newUser = await User.create({
      fullName, email, password:hashedPassword, bio
    });

    // now we have created new user in mongodb databse
    
    // creating token => using which we can authenticate the user -> to create this token we will make separate fun in lib folder
    const token  = generateToken(newUser._id)  // using token fun form utils by passing ths userid
    
    // sending token to response :
    res.json({success:true, userData:newUser, token, message:"Account created successfully"})

  } catch(error) {
    console.log(error.message);
    res.json({success:false, message: error.message})

  }
}


// Controller to login a user :

// user login function(async) :
export const login = async(req,res) => {
  try {
    
    // getting email & password from req body(user)
    const {email,password} = req.body;
    // checking email
    const userData = await User.findOne({email})
    
    // checking password
    const isPasswordCorrect = await bcrypt.compare(password,userData.password);

    if(!isPasswordCorrect){ // if password is incorrect
      return res.json({success:false, message:"Invalid credentials"});
    }
    
    // if password is correct => token will be generated

    const token  = generateToken(userData._id)
    
    // sending token to response
    res.json({success:true, userData, token, message:"Login successfully"})


  }  catch (error) {

    console.log(error.message);
    res.json({success:false, message: error.message})    

  }
}

// Controller to check if  user is authenticated

// user authentication function :
export const checkAuth = (req,res) => {
  // using middleware response (req.user)
  res.json({success: true , user:req.user});   // this fun will return user data when user is authenticated
}


// Controller to update user profile details

// userprofile update function :
export const updateProfile = async (req,res) =>{

  try { 

    // to update prfoile we need fullname,bio,picture => we will get form user(rew body)

    const {profilePic,bio,fullName} = req.body; // getting from req body
    const userId = req.user._id; // gettign user id from req (using middleware)

    let updatedUser; // variable for storing updated data

    if(!profilePic){// if user not want to update profile pic (profile picture is not provided)
      updatedUser = await User.findByIdAndUpdate(userId,{bio,fullName},{new:true}) // updating bio & fullname only of particualr userid => new data will be updated -> we will get updated user data  & we will store in a variable
    }

    else { // if profile picture is provided
      const upload = await cloudinary.uploader.upload(profilePic); // uploading pic on cloudinary to get the url

      updatedUser = await User.findByIdAndUpdate(userId, {profilePic:upload.secure_url,bio,fullName}, {new:true} ) // upddting user data
    }
    
    // sending response
    res.json({success:true, user:updatedUser})


  } catch (error) {

      console.log(error.message);
      res.json({success:false, message:error.message})

  }

}

// Now we will create API end points  for all these controller function

