// Using this controller function we will store the message data & display it on webpage  (watch again)


import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io,userSocketMap } from "../server.js";


// Get all users except the logged in user

// function for the data in rightsidebar of chat-page :
export const getUserForSidebar = async (req,res) => {

  // using this fun we will get he list of users & with that we will get no of unread mesaages for the user
  try {


    const userId = req.user._id; // gettign user id

    // filtering users from all users list & we will exclude this selected user with removed password => (when the selected user chat is opened)
    const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password");

    // Count number of messages not seen  
    const unseenMessages = {}
    const promises = filteredUsers.map(async (user) => { // we will get indivivual user
      const messages = await Message.find({senderId: user._id, receiverId:userId,seen:false})
      if(messages.length > 0){
        unseenMessages[user._id] = messages.length;
      }
    })


    await Promise.all(promises);
    res.json({success:true, users:filteredUsers, unseenMessages})



  } catch (error) {
      console.log(error.message);
      res.json({success:false, message:error.message})

  }

}


// Get all messages for selected user

// function for getting messages :
export const getMessages = async (req,res) => {

  try{

    // for getting selected userid
    const {id:selecteduserId} = req.params; // destructuring the id we will get from params
    const myId = req.user._id; // id of loggedin user(host)
    
    // for getting messages (between two users) :
    const messages = await Message.find({
      $or: [
        {senderId: myId, receiverId: selecteduserId},
        {senderId: selecteduserId, receiverId: myId},
      ]
    })

    // marking messages as read => (all the messages will be marked as seen when we open any(selected) user chat)
    await Message.updateMany({senderId: selecteduserId, receiverId:myId}, {seen:true});

    res.json({success:true,messages})


  } catch(error) {

      console.log(error.message);
      res.json({success:false, message:error.message})    


  }
  
}

// api to mark message as seen using message id (for individual message => seen property for ongoing chat)
export const markMessageAsSeen = async(req,res) =>{

  try{
    const {id} =req.params;
    await Message.findByIdAndUpdate(id , {seen:true})
    res.json({success:true})

  } catch(error) {

      console.log(error.message);
      res.json({success:false, message:error.message})    

  }  

}


// Send message to selected user 

// function for sending the message to selected user 
export const sendMessage = async (req,res) => {

  try{

    // for sending message we will get the message data 

    const {text,image} =req.body; // destructuring the text & image from req body
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if(image) {
      const uploadResponse = await cloudinary.uploader.upload(image)
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl
    })


    // CHAT-GPT for sending message :
    
    // export const sendMessage = async (req, res) => {
    //   try {
    //     const { text, image, file, fileName, voice, duration, messageType } = req.body; 
    //     const receiverId = req.params.id;
    //     const senderId = req.user._id;
    
    //     let imageUrl, fileUrl, voiceUrl;
    
    //     // Upload image if exists
    //     if (image) {
    //       const uploadResponse = await cloudinary.uploader.upload(image);
    //       imageUrl = uploadResponse.secure_url;
    //     }
    
    //     // Upload file if exists
    //     if (file) {
    //       const uploadResponse = await cloudinary.uploader.upload(file, {
    //         resource_type: "raw"  // important for pdf/docx/zip etc.
    //       });
    //       fileUrl = uploadResponse.secure_url;
    //     }
    
    //     // Upload voice if exists
    //     if (voice) {
    //       const uploadResponse = await cloudinary.uploader.upload(voice, {
    //         resource_type: "video" // cloudinary voice/audio = video type
    //       });
    //       voiceUrl = uploadResponse.secure_url;
    //     }
    
    //     const newMessage = await Message.create({
    //       senderId,
    //       receiverId,
    //       messageType,   // "text" | "image" | "file" | "voice"
    //       text,
    //       imageUrl,
    //       fileUrl,
    //       fileName,
    //       voiceUrl,
    //       duration,
    //     });
    


    // Emit to receiver socket => For displaying message to reciever in real time we will use socket.io

    // Emit the new message to the reciever's socket
    const receiverSocketId = userSocketMap[receiverId];
    if(receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage",newMessage)
    }

    res.json({success:true, newMessage});


  } catch(error) {

      console.log(error.message);
      res.json({success:false, message:error.message})    

  }   

}







// CHAT-GPT


// import Message from "../models/Message.js";
// import User from "../models/User.js";
// import cloudinary from "../lib/cloudinary.js";
// import { io, userSocketMap } from "../server.js";


// // ✅ Get all users except the logged-in user (for sidebar)
// export const getUserForSidebar = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const filteredUsers = await User.find({ _id: { $ne: userId } })
//       .select("-password");

//     // Count number of unseen messages for each user
//     const unseenMessages = {};
//     const promises = filteredUsers.map(async (user) => {
//       const messages = await Message.find({
//         senderId: user._id,
//         receiverId: userId,
//         seen: false,
//       });
//       if (messages.length > 0) {
//         unseenMessages[user._id] = messages.length;
//       }
//     });

//     await Promise.all(promises);

//     res.status(200).json({
//       success: true,
//       users: filteredUsers,
//       unseenMessages,
//     });

//   } catch (error) {
//     console.error("Error in getUserForSidebar:", error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// // ✅ Get all messages for selected user
// export const getMessages = async (req, res) => {
//   try {
//     const { id: selectedUserId } = req.params;
//     const myId = req.user._id;

//     const messages = await Message.find({
//       $or: [
//         { senderId: myId, receiverId: selectedUserId },
//         { senderId: selectedUserId, receiverId: myId },
//       ],
//     });

//     // Mark received messages as seen
//     await Message.updateMany(
//       { senderId: selectedUserId, receiverId: myId },
//       { seen: true }
//     );

//     res.status(200).json({ success: true, messages });
//   } catch (error) {
//     console.error("Error in getMessages:", error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// // ✅ Mark message as seen using message ID
// export const markMessageAsSeen = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Message.findByIdAndUpdate(id, { seen: true });
//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("Error in markMessageAsSeen:", error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// // ✅ Send message to selected user
// export const sendMessage = async (req, res) => {
//   try {
//     const { text, image } = req.body;
//     const receiverId = req.params.id;
//     const senderId = req.user._id;

//     let imageUrl;
//     if (image) {
//       const uploadResponse = await cloudinary.uploader.upload(image);
//       imageUrl = uploadResponse.secure_url;
//     }

//     const newMessage = await Message.create({
//       senderId,
//       receiverId,
//       text,
//       image: imageUrl,
//     });

//     // Emit the new message to the receiver's socket
//     const receiverSocketId = userSocketMap[receiverId];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", newMessage);
//     }

//     res.status(201).json({ success: true, newMessage });

//   } catch (error) {
//     console.error("Error in sendMessage:", error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
