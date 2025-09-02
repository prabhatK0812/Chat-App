import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  
  // for checking user authentication (after backend)
  const {authUser, updateProfile} = useContext(AuthContext)

  // use state for storing user image:
  const [selectedImg,setSelectedImg] = useState(null) // initially user image is null

 
  const navigate = useNavigate();  // for naviagtion 

  // use state for storing updated user data (by default initial value) :
  const [name,setName] = useState(authUser.fullName)
  const [bio,setBio] = useState(authUser.bio)

  // function for handling the form :
  const handleSubmit = async (e) => {
    e.preventDefault(); // for preventing default behaviour
    
    if(!selectedImg){
      await updateProfile({fullName: name,bio})
      navigate('/'); // for navigating user to home page after updating details
      return;
    }

    
    // after selecting image => converting it into base64 image
    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({profilePic:base64Image,fullName: name,bio})
      navigate('/');

    }
    
  }


  return (
    // main div :
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      
      {/* data will be in two col -> right (update section) &  left (user image)  */}
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2
      border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'> 
        
        {/* -------left side------- */}

        {/* form for profile updation : */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          {/* for title : */}
          <h3 className='text-lg'>Profile Details</h3>
          
          {/* for profile image: */}
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e)=> setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>
            {/* for displaying selected img in circular style: */}
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImg && 
            'rounded-full'}`}/>
            upload pofile image
          </label>
          
          {/* input field for full name: */}
          <input onChange={(e)=>setName(e.target.value)} value={name}
          type="text" required placeholder='Your name' className='p-2 border
          border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'/>

          {/* for bio: */}
          <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
          placeholder='Write profile bio' required className='p-2 border
          border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' rows={4}></textarea>
 
          {/* submit button: */}
          <button type='submit' className='bg-gradient-to-r form-purple-400
          to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'>Save</button>
        </form>

        {/* -----right side------*/}
        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 $
        {selectedImg && 'rounded-full'}`} src={authUser?.profilePic || assets.logo_icon} alt="" />

      </div>

      
    </div>
  )
}

export default ProfilePage
