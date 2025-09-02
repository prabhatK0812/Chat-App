import React, { useContext, useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'


const HomePage = () => {



  // // State variable :
  // const [selectedUser, setSelectedUser] = useState(false) 
  // // In template literal =>  whenever the selcted user is false(no user is selected for chat) we will display only two components -> chat box with chat icon in right & users list in left 

  // after backend we will get selected user data from context 
  const {selectedUser} = useContext(ChatContext)

  return (
    // mai div => image pure entire web page pr aayega jo initially top pr th App.jsx wale m
    <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>

      {/* div for creating diff components column */}
      <div  className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl 
      overflow-hidden h-[100%] grid grid-cols-1 relative ${selectedUser ? 
      'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2' }
      `}> 

      {/* template literals is used for using (variable css) & the state variable */}
      

        {/* Mounitng components & passing propts: */}

        {/* #before backend */}
        {/* <Sidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
        <ChatContainer selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
        <RightSidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />         */}

        {/* #after backend remove the propts: */}
        <Sidebar/>
        <ChatContainer/>
        <RightSidebar/>


      </div>

      
    </div>
  )
}

export default HomePage
