// 1
import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";

import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// 1.Create Express app and HTTP server

const app = express();

const server = http.createServer(app) // we are using this http create server because socketio supports this http server

// 4.Initialize socket.io serer
export const io = new Server(server,{
  cors: {origin: "*"}
})

// 4.Store online users
export const userSocketMap = {}; // {userId: socketId} => in this object we will store data of online users & here we will add data in from of userid & socket id


// 4.Socket.io connection handler (function) -> understand
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  if(userId) userSocketMap[userId] = socket.id;

  // Emit online users to all connected clients
  io.emit("getOnlineUsers",Object.keys(userSocketMap));

  // disconnect events :
  socket.on("disconnect", ()=>{
    console.log("User Disconnected",userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers",Object.keys(userSocketMap)) // using this we will emit the online users to all connected clients
  })

})


// 1.Middleware setup

app.use(express.json({limit:"4mb"})); // for uploading images of max 4mb
app.use(cors()); // for allowing all url to connect with backend


// Routes setup :

// 1.API end point to test server
app.use("/api/status", (req,res) => res.send("Server is Live")); // for checking server status

// 2.Adding usersAPIs end point from userrouter 
app.use("/api/auth",userRouter);

// 3.Adding messageAPIs end point from messagerouter 
app.use("/api/messages",messageRouter);


// Connect to MongoDB
await connectDB ();



// 1.port no where server will run :
const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=>console.log("Server is running on PORT: " + PORT)); // for starting the server