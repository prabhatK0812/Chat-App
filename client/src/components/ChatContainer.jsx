import React, { useContext, useEffect, useRef, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils'

import { AuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { ChatContext } from '../context/ChatContext'
import EmojiPicker from './EmojiPicker'

const ChatContainer = ({ onOpenProfile }) => {  // getting propts & destructuring it (inside curly bracket) => after backend we will get data from context so remove it
  
  // after backend
  const {messages,selectedUser,setSelectedUser,sendMessage, getMessages} = useContext(ChatContext) // getting messages,selectedUser,setSelectedUser,sendMessage from ChatContext
  const {authUser, onlineUsers} = useContext(AuthContext)


  // function for scrolling the container at latest message :
  const scrollEnd = useRef()

  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const audioChunksRef = useRef([]);

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

  // Handle sending a file
  const handleSendFile = async(e)=>{
    const file = e.target.files[0];
    if(!file){
      toast.error("Please select a file")
      return;
    }
    const reader = new FileReader();
    
    reader.onloadend = async () =>{
      await sendMessage({
        file : reader.result,
        fileName: file.name,
        fileType: file.type
      })
      e.target.value = ""
    }

    reader.readAsDataURL(file)
  }

  // Handle voice recording
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        
        reader.onloadend = async () => {
          const duration = Math.round(audioBlob.size / 16000); // rough estimate
          await sendMessage({
            voice: reader.result,
            duration: duration
          });
        };
        
        reader.readAsDataURL(audioBlob);
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started...");
    } catch (error) {
      toast.error("Microphone access denied");
      console.log(error);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Voice message sent!");
    }
  }; 

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
        <button type='button' onClick={onOpenProfile} className='inline-flex items-center justify-center rounded-full p-1 hover:bg-white/10 transition'>
          <img src={assets.help_icon} alt="Open profile drawer" className='max-md:hidden max-w-5' />
        </button>

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

            ) : msg.file ? ( // if file is available
              <a href={msg.file} download={msg.fileName}
              className='p-3 max-w-[200px] mb-8 bg-blue-500/30 text-white rounded-lg flex items-center gap-2 hover:bg-blue-500/50 transition'>
                <span className='text-lg'>📄</span>
                <div className='flex flex-col'>
                  <p className='text-xs font-semibold truncate'>{msg.fileName}</p>
                  <p className='text-xs text-gray-300'>{msg.fileType}</p>
                </div>
              </a>

            ) : msg.voice ? ( // if voice message is available
              <div className='p-3 max-w-[200px] mb-8 bg-green-500/30 text-white rounded-lg flex items-center gap-2'>
                <span className='text-lg'>🎙️</span>
                <audio controls className='h-6 flex-1' style={{accentColor: '#10b981'}}>
                  <source src={msg.voice} type="audio/webm" />
                  Your browser does not support the audio element.
                </audio>
                <p className='text-xs text-gray-300'>{msg.duration}s</p>
              </div>

            ) : ( // if text message
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


      {/* ------bottom area of chat => mesaages,images,files,voice bhejne k liye---------*/}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>

        {/* div for input field (message, image, file): */}
        <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full relative'>
          {/* Emoji picker panel */}
          {showEmoji && (
            <div className='absolute bottom-14 left-3'>
              <EmojiPicker onSelect={(emo) => setInput((s) => s + emo)} onClose={() => setShowEmoji(false)} />
            </div>
          )}
          <input onChange={(e) => setInput(e.target.value)} value={input} onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null} 
          type="text" placeholder='Send a message' 
          className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'/>
          
          {/* Emoji toggle button */}
          <button type='button' onClick={() => setShowEmoji((s) => !s)} className='p-1 mr-1 rounded-full hover:bg-white/10 transition' title='Open emoji picker'>
            <span className='text-lg'>😊</span>
          </button>

          {/* for image input: */}
          <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden/>
          {/* label tag -> for choosing image file: */}
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer hover:opacity-70 transition'/>
          </label>

          {/* for file input: */}
          <input onChange={handleSendFile} type="file" id='file' hidden/>
          {/* label tag -> for choosing any file: */}
          <label htmlFor="file">
            <span className='text-lg mr-2 cursor-pointer hover:opacity-70 transition'>📎</span>
          </label>
        </div>

        {/* Voice message button */}
        {!isRecording ? (
          <button onClick={startVoiceRecording} className='p-2 rounded-full hover:bg-white/10 transition' title='Record voice message'>
            <span className='text-lg'>🎙️</span>
          </button>
        ) : (
          <button onClick={stopVoiceRecording} className='p-2 rounded-full bg-red-500/30 hover:bg-red-500/50 transition animate-pulse' title='Stop recording'>
            <span className='text-lg'>⏹️</span>
          </button>
        )}

        {/* // for send button icon*/}
        <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-7 cursor-pointer hover:opacity-70 transition'/>

      </div>
      
    </div>
  ) : (

    <div className='flex flex-col items-center justify-center gap-4 text-center text-gray-300 bg-white/10 max-md:hidden h-full'>
      <img src={'/messenger.svg'} className='max-w-20' alt='QuickChat logo' />
      <div className='space-y-2'>
        <p className='text-xl font-semibold text-white'>Select a chat to continue</p>
        {/* <p className='max-w-sm text-sm text-gray-400'>Choose a user from the left sidebar, then click the info icon to open the profile drawer.</p> */}
      </div>
    </div>

  )
}

export default ChatContainer
