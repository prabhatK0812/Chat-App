// import React, { useContext, useEffect, useState } from 'react'
// import assets from '../assets/assets'  // before backend
// import { useNavigate } from 'react-router-dom'
// import { AuthContext } from '../../context/AuthContext'
// import { ChatContext } from '../../context/ChatContext'

// const Sidebar = () => { // in bracket we will get data from context
  
//   // getting data from usecontext (after backend)
//   const {getUsers, users, selectedUser, setSelectedUser,
//     unseenMessages, setUnseenMessages } = useContext(ChatContext);

//   const {logout , onlineUsers} = useContext(AuthContext)

//   const [input , setInput] = useState(false)

//   // for naviagtion -> add usenaviagte hook: 
//   const navigate = useNavigate();  

//   // for filtering user
//   const filteredUsers = input ? users.filter((user) => user.fullName.toLowerCase().
//   includes(input.toLowerCase())) : users;
  
//   // 
//   useEffect(() =>{
//     getUsers();

//   },[onlineUsers])

//   return (
//     // parent div => with template literals 
//     <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ''}`}>

//       {/* main div for div-1 & div-2   : */}
//       <div className='pb-5'>

//         {/* div-1 for app logo & menu */}
//         <div className='flex justify-between items-center'>

//           {/* for logo: */}
//           <img src={assets.logo} alt="logo" className='max-w-40' />

//           {/* div for menu (icon & items): */}
//           <div className='relative py-2 group'>
//             {/* menu-icon img */}
//             <img src={assets.menu_icon} alt="Menu" className='max-h-5 cursor-pointer' />
//             {/* div for sub-menu items: */}
//             <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md
//             bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
//               <p onClick={()=>navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
//               {/* for horizontal line: */}
//               <hr className='my-2 border-t border-gray-500' />
//               <p onClick={()=> logout()} className='cursor-pointer text-sm'>Logout</p>
//             </div>
//           </div>

//         </div>
          

//         {/* div-2 for search icon & input field: */}
//         <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
//           <img src={assets.search_icon} alt="Search" className='w-3' />
//           <input onChange={(e) =>setInput(e.target.value) } type="text" className='bg-transparent border-none outline-none 
//           text-white text-xs placeholder:[#c8c8c8] flex-1' placeholder='Search User...'/>
//         </div>

//       </div>

//       {/* div for displaying users profile  (details): */}
//       <div className='flex flex-col'>
//         {filteredUsers.map((user,index) => (  // this arrow fun will return a div of individual user
//           // on clicking we can select the user => pass this propts where we have mounted sidebar component -> for opening particular user chat container => three columns will be displyed on screen in this case
//           <div onClick={() => {setSelectedUser(user) ; setUnseenMessages(prev=> ({...prev, [user._id] : 0}))} } key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded
//           cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 
//           'bg-[#282142]/50'}`}>

//             {/* for user profile image (if no profile image display avatar-icon): */}
//             <img src={user?.profilePic || assets.avatar_icon} alt="" 
//             className='w-[35px] aspect-[1/1] rounded-full'/>
//             {/* div for displaying user fullname & online status: */}
//             <div className='flex flex-col leading-5'>
//               <p>{user.fullName}</p>
//               {
//                 // index <3 -> (before backend)

//                 // for online or offline status :
//                 onlineUsers.includes(user._id)
//                 ? <span className='text-green-400 text-xs'>Online</span>
//                 : <span className='text-neutral-400 text-xs'>Offline</span>
//               }
//             </div>
            
//             {/* for displaying no of unseen mesaages in right of user profile : */}
//             {unseenMessages?.[user._id] > 0 && <p className='absolute top-4 right-4 text-xs h-5 w-5
//             flex justify-center items-center rounded-full bg-violet-500/50'>
//             {unseenMessages[user._id]}</p>}

//           </div>
//         ) )}


//       </div>
      


//     </div>
//   )
// }

// export default Sidebar


// NOTE: if any user is selected there will be three columns  => sidebar, chatcontainer(of selected user), rightsidebar 
// if no user is selscted there will be only two columns => sidebar & chatcontainer(only icon)


// CHAT-GPT :


import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import axios from 'axios';

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);

  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  // Filtered users based on search input
  const filteredUsers = searchInput
    ? users.filter(user => user.fullName.toLowerCase().includes(searchInput.toLowerCase()))
    : users;

  // Initial load → fetch users
  useEffect(() => {
    getUsers();
  }, []);

  // Function to mark messages as seen
  const handleUserClick = async (user) => {
    setSelectedUser(user);

    // mark messages as seen in backend
    try {
      await axios.put(`/api/messages/mark-seen/${user._id}`);
    } catch (err) {
      console.error("Error marking messages as seen", err);
    }

    // update local unseenMessages
    setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }));

    // refresh users list to get updated unseen counts
    getUsers();
  };

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ''}`}>

      {/* Header: Logo + Menu */}
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
          <img src={assets.logo} alt="logo" className='max-w-40' />
          <div className='relative py-2 group'>
            <img src={assets.menu_icon} alt="Menu" className='max-h-5 cursor-pointer' />
            <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
              <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
              <hr className='my-2 border-t border-gray-500' />
              <p onClick={() => logout()} className='cursor-pointer text-sm'>Logout</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
          <img src={assets.search_icon} alt="Search" className='w-3' />
          <input
            type="text"
            placeholder='Search User...'
            className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1'
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      {/* Users List */}
      <div className='flex flex-col'>
        {filteredUsers.map(user => (
          <div
            key={user._id}
            onClick={() => handleUserClick(user)}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm
            ${selectedUser?._id === user._id ? 'bg-[#282142]/50' : ''}`}
          >
            {/* User Image */}
            <img src={user?.profilePic || assets.avatar_icon} alt="" className='w-[35px] aspect-[1/1] rounded-full' />

            {/* Name + Online Status */}
            <div className='flex flex-col leading-5'>
              <p>{user.fullName}</p>
              {onlineUsers.includes(user._id)
                ? <span className='text-green-400 text-xs'>Online</span>
                : <span className='text-neutral-400 text-xs'>Offline</span>
              }
            </div>

            {/* Unseen Messages */}
            {unseenMessages?.[user._id] > 0 && (
              <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default Sidebar;
