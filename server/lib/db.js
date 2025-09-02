// importing mongoose :
import mongoose from  "mongoose";

// function to connect with the database :

export const connectDB = async () => {

  // in this try block we will connect mongoose
  try{

    // adding event -> whenever we will connected with databse we will se message in console 
    mongoose.connection.on('connected' , () => console.log ('Database Connected'));
    
    // provide connection string
    await mongoose.connect(`${process.env.MONGODB_URI}/quickchat`)


  }  catch (error){ // for any error
       console.log(error)

  }


}