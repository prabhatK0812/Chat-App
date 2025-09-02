import React, { useContext, useEffect, useRef, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils'

import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { ChatContext } from '../../context/chatContext'

const ChatContainer = () => {  // getting propts & destructuring it (inside curly bracket) => after backend we will get data from context so remove it
  
  // after backend
  const {messages,selectedUser,setSelectedUser,sendMessage, getMessages} = useContext(ChatContext) // getting messages,selectedUser,setSelectedUser,sendMessage from ChatContext
  const {authUser, onlineUsers} = useContext(AuthContext)


  // function for scrolling the container at latest message :
  const scrollEnd = useRef()

  const [input, setInput] = useState('');

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if(input.trim() === "") return null;
    await sendMessage({text : input.trim()});
    setInput("")

  }

  // Handle sending an image
  const handleSendImage = async(e)=>{
    const file = e.target.files[0];
    if(!file || !file.type.startsWith("image/")){
      toast.error("select an image file")
      return;
    }
    const reader = new FileReader();
    
    reader.onloadend = async () =>{
      await sendMessage({image : reader.result})
      e.target.value = ""
    }

    reader.readAsDataURL(file)
  } 

  useEffect(() => {
    if(selectedUser){
      getMessages(selectedUser._id)

    }

  },[selectedUser])


  useEffect(() => {
    if(scrollEnd.current && messages){
      scrollEnd.current.scrollIntoView({behavior:"smooth"})  // for smmothly scorolling the web page(of chat container) to the div in which this fun will be used
    }

  },[messages]) // dependencies => array is empty (before backend)

  return selectedUser ? (

    // main div : This div will be rendered whenever the selected user is true
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      
      {/* -------header part of chat conatiner-------*/}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        {/* for user image: */}
        <img src={selectedUser.profilePic || assets.avatar_icon } alt=""  className='w-8 rounded-full'/>
        {/* for user name: */}
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
            {selectedUser.fullName}
            {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
        </p>
        {/* for arrow icon in right side: */}
        <img onClick={()=> setSelectedUser(null) } src={assets.arrow_icon} alt=""  className='md:hidden max-w-7'/>
        {/* for info icon: */}
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />

      </div>

      {/* -------chat area-------- */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        {messages.map((msg,index) => ( // for displaying messages dummy data from assets (before backend) 
          // returning a div (understand the code logic):
          <div key={index} className={`flex items-end gap-2 justify-end 
          ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>

            {msg.image ? ( // if image is available
              <img src={msg.image} alt="" className='max-w-[230px] border
              border-gray-700 rounded-lg overflow-hidden mb-8' />

            ) : ( // if image is not available

              <p className={`p-2 max-w-[200px] md:text-sm font-light
              rounded-lg mb-8 break-all bg-violet-500/30 text-white
              ${msg.senderId === authUser._id ? 'rounded-br-none' : 
              'rounded-bl-none'}`}>{msg.text}</p>
            )}

            {/* div for sender info: */}
            <div className='text-center text-xs'>
              {/* for sender img: */}
              <img src={msg.senderId === authUser._id ?  authUser?. profilePic || assets.avatar_icon :  selectedUser?.profilePic || assets.avatar_icon } alt=""
              className='w-7 rounded-full' />
              {/* for message send time: */}
              <p className='text-gray-500'>{formatMessageTime(msg.createdAt) }</p>
            </div>

          </div>
        ))}
        
        {/* div for scrooling the chatcaontainer to this div on opening(at latest message): */}
        <div ref={scrollEnd}></div>

      </div>


      {/* ------bottom area of chat => mesaages,images bhejne k liye---------*/}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>

        {/* div for input field (message, image): */}
        <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
          <input onChange={(e) => setInput(e.target.value)} value={input} onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null} 
          type="text" placeholder='Send a message' 
          className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'/>
          {/* for image input: */}
          <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden/>
          {/* label tag -> for asking to choose the file on clicking the gallery icon: */}
          <label htmlFor="image">
            {/* for gallery( image select) icon in right side : */}
            <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer'/>
          </label>
        </div>

        {/* // for send button icon*/}
        <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-7 cursor-pointer'/>

      </div>


      {/* ------bottom area of chat => mesaages,images,files,voice bhejne k liye---------*/}
      {/* <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'> */}
        {/* Input + Uploads */}
        {/* <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'> */}
          {/* Text input */}
          {/* <input 
            type="text" 
            placeholder='Send a message' 
            className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'
          /> */}
      
          {/* File Upload (Image, Docs, etc.) */}
          {/* <input type="file" id='fileUpload' accept="image/*, .pdf, .doc, .docx" hidden />
          <label htmlFor="fileUpload">
            <img src={assets.gallery_icon} alt="Upload" className='w-5 mr-2 cursor-pointer' />
          </label> */}
      
          {/* Voice Message (mic button) */}
          {/* <button type="button">
            <img src={assets.mic_icon} alt="Voice" className='w-5 mr-2 cursor-pointer' />
          </button>
        </div> */}
      
        {/* Send button */}
        {/* <img src={assets.send_button} alt="Send" className='w-7 cursor-pointer' />
      </div> */}
      

      







    </div>
  ) : (  // when the selected user is not true => we will just display the logo & a message

    <div className='flex flex-col items-center justify-center gap-2 text-gray-500
    bg-white/10 max-md:hidden'>
      {/* for logo icon: */}
      <img src={assets.logo_icon} className='max-w-16' alt="" />
      <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>

  )
}

export default ChatContainer
