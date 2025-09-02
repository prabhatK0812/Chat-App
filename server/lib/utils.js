// we will generate the token using jsonwebtoken pacakge

import jwt from "jsonwebtoken";

// Function to generate a token for a user

export const generateToken = (userId) => { // to generate token we need unique userid which we will pass in para
  const token = jwt.sign({userId},process.env.JWT_SECRET); // add secret key in env variable and use it here
  return token;
}