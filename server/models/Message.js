import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
  receiverId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
  text: {type:String},
  image: {type:String},
  seen: {type: Boolean, default:false} // each message will be created with seen property false

} , {timestamps:true});

const Message = mongoose.model("Message",messageSchema);

export default Message;

// Now using this message model we can store the message data in databse



// CHAT-GPT :

// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//   {
//     senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

//     messageType: {
//       type: String,
//       enum: ["text", "image", "file", "voice"],
//       required: true,
//     },

//     // Text message
//     text: { type: String },

//     // Image message
//     imageUrl: { type: String },

//     // File message (pdf, docx, etc.)
//     fileUrl: { type: String },
//     fileName: { type: String },

//     // Voice message
//     voiceUrl: { type: String },
//     duration: { type: Number }, // seconds

//     // Seen/Read status
//     seen: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// const Message = mongoose.model("Message", messageSchema);

// export default Message;
