import React, { useContext, useEffect, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext';

const RightSidebar = ({ isOpen, onClose }) => { // destructuring the selectedUser  getting from propts => after backend we will get the data from context

  const {selectedUser,messages} = useContext(ChatContext); // getting selectedUser from chatContext
  
  const {logout,onlineUsers} = useContext(AuthContext); // getting logout function and onlineUsers from AuthContext 
  const [msgImages, setMsgImages] = useState([]); // state to hold images in messages

  // Get all the images  fromt he messages and set them to state
  useEffect(() => {
    setMsgImages(messages.filter(msg => msg.image).map(msg => msg.image));
  }, [messages]) // whenever messages change, this will run and update msgImages







  if (!selectedUser || !isOpen) return null;

  return (
    <div className='absolute inset-y-0 right-0 z-50 flex w-[320px]'>
      <button
        type='button'
        onClick={onClose}
        className='absolute inset-0 bg-black/30 backdrop-blur-sm'
        aria-label='Close profile drawer'
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className='relative z-10 h-full w-full bg-[#0f172a] text-white shadow-2xl border-l border-white/10'
      >
        <div className='h-full w-full overflow-y-scroll'>
          <div className='px-5 pt-4'>
            <div className='flex items-center justify-between gap-2 pb-4'>
              <button
                type='button'
                onClick={onClose}
                className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition'
                aria-label='Close profile drawer'
              >
                <img src={assets.arrow_icon} alt='Back' className='w-4 h-4 rotate-180' />
              </button>
              <p className='text-sm font-medium text-white/80'>Profile</p>
            </div>
            <div className='pt-4 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
              <img
                src={selectedUser?.profilePic || assets.avatar_icon}
                alt=''
                className='w-20 aspect-[1/1] rounded-full'
              />
              <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
                {onlineUsers.includes(selectedUser._id) && (
                  <p className='w-2 h-2 rounded-full bg-green-500' />
                )}
                {selectedUser.fullName}
              </h1>
              <p className='px-10 mx-auto'>{selectedUser.bio}</p>
            </div>
            <hr className='border-[#ffffff50] my-4' />
            <div className='px-5 text-xs'>
              <p className='text-lg font-semibold mb-3'>Media</p>
              <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
                {msgImages.map((url, index) => (
                  <div
                    key={index}
                    onClick={() => window.open(url)}
                    className='cursor-pointer rounded overflow-hidden'
                  >
                    <img src={url} alt='' className='h-full w-full rounded-md object-cover' />
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => logout()}
              className='mt-6 mb-5 mx-auto block rounded-full bg-gradient-to-r from-purple-400 to-violet-600 px-8 py-3 text-sm font-light text-white transition hover:opacity-90'
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightSidebar

// mount this component :

