import React, { useContext, useEffect, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext';

const RightSidebar = () => { // destructuring the selectedUser  getting from propts => after backend we will get the data from context

  const {selectedUser,messages} = useContext(ChatContext); // getting selectedUser from chatContext
  
  const {logout,onlineUsers} = useContext(AuthContext); // getting logout function and onlineUsers from AuthContext 
  const [msgImages, setMsgImages] = useState([]); // state to hold images in messages

  // Get all the images  fromt he messages and set them to state
  useEffect(() => {
    setMsgImages(messages.filter(msg => msg.image).map(msg => msg.image));
  }, [messages]) // whenever messages change, this will run and update msgImages







  return selectedUser && ( // when selcted user is true then only this div will be displayed
    
    // main div  with template literal(understand ) :
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll
    ${selectedUser ? "max-md:hidden" : ""}`}>

      {/* div for 1st part (selected user => image,name,bio): */}
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        {/* for user image (of selected user) */}
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" 
        className='w-20 aspect-[1/1] rounded-full'/>
        {/* for user name & online (green)icon */}
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
           {onlineUsers.includes(selectedUser._id) && <p className='w-2 h-2 rounded-full bg-green-500'></p>}
          {selectedUser.fullName}
        </h1>
        {/* for user bio */}
        <p className='px-10 mx-auto'>{selectedUser.bio}</p>
      </div>
      
      {/* for horizontal line : */}
      <hr className='border-[#ffffff50] my-4'/>

      {/* div for : */}
      <div className='px-5 textt-xs'>
        <p>Media</p>
        {/* div for images: */}
        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
          {msgImages.map((url,index) => (  // getting images from dummy data
            // arrow fun returning a div => if we click the img it will open image in new window
            <div key={index } onClick={() => window.open(url)} className='cursor-pointer rounded'>
              <img src={url} alt="" className='h-full rounded-md' />
            </div>
          ))}
        </div>
      </div>

      {/* for logout button at bottom: */}
      <button onClick={()=> logout()} className='absolute bottom-5 left-1/2 transform -translate-x-1/2
      bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none 
      text-sm font-light py-2 px-20 rounded-full cursor-pointer'>
         Logout
      </button>
    
      
    </div>
  )
}

export default RightSidebar

// mount this component :

