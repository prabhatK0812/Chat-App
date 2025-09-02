// In this we will add all state variables & function related to the authentication (understad this context)

import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";
import {io} from "socket.io-client";

// adding backend url 
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// adding backend url in axios as a base url
axios.defaults.baseURL = backendUrl;

// creating context using createcontext hook :
export const AuthContext = createContext();

// auth provider function :
export const AuthProvider = ({children}) =>{
  

  // adding state variables :
  const [token,setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers,setOnlineUsers] =useState([]);
  const [socket,setSocket]=useState(null);
  // pass these variables to value object

  // Check if user is authenticated and if so, set the user data and connect the socket

  const CheckAuth = async () => {
    try {

      const {data} = await axios.get("/api/auth/check");
      if(data.success) {
        setAuthUser(data.user)
        connectSocket(data.user)
      }

    } catch (error) {
        toast.error(error.message)
    }
  
  }


  // Login function to handle user authentication and socket connection

  const login = async (state,credentials) => {
    try{
      const {data} = await axios.post(`/api/auth/${state}`,credentials);
      if (data.success){
        setAuthUser(data.userData);
        connectSocket(data.userData);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token",data.token)
        toast.success(data.message)
      }

      else{
        toast.error(error.message)

      }


    } catch(error) {
       toast.error(error.message)

    }
    
  }

  // Logout function to handle user logout and socket disconnection
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out successfully")
    socket.disconnect();
    
  }

  // Update profile function to handle user profile updates

  const updateProfile = async (body) => {
    try {
      const {data} = await axios.put("/api/auth/update-profile",body);
      if(data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully")
      }
    } catch (error) {
        toast.error(error.message)

    }

  }



  // Connect socket function to handle socket connections and online users updates
  
  const connectSocket = (userData) => {
    if(!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      }
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers",(userIds)=>{
      setOnlineUsers(userIds);

    })

  }


  // for executing checkauth fun whenever the web page is loaded
  useEffect (() => {
    if(token){
      axios.defaults.headers.common["token"] = token;
    }
    CheckAuth()


  },[])

  // value object 
  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile

  }


  // return for auth provider function :
  return(
   
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )

  // add support of this context in main.jsx file

}

// whatever state variable & func we will add in the value object we can access it in any other component using this context