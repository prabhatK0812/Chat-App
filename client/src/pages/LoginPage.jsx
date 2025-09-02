import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../context/AuthContext'

const LoginPage = () => {

  // state variable for title(signup/login) in form:
  const [currState,setCurrState] = useState("Sign up") 

  // // we will store these data in a state variable using onChange property : : 

  // state variables for storing the signup data :
  const [fullName,setFullName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [bio,setBio] = useState("")

  // state variable for submission:
  const [isDataSubmitted,setIsDataSubmitted] = useState(false);  // for whether we have submitted the above data or not

  // for context (after backend)
  const {login} = useContext(AuthContext)

  // onsubmithandler function :
  const onSubmitHandler = (event) => {
    event.preventDefault(); // for preventing default behaviour on submiiting the form (changing the page ) => stop webpage from loading
    
    // when we submit the form it will check for curr state
    if(currState === 'Sign up'  && !isDataSubmitted){  // when data is not submiited
      setIsDataSubmitted(true) // submiting the data
      return;
    }
    
    // adding login fun (after backend)
    login(currState === "Sign up" ? 'signup' : 'login', {fullName, email, password, bio})

  }

  return ( // in this page we will add contnet in two column => in left -> img & in right -> form

    // main div:
    <div className='min-h-screen bg-cover bg-center flex items-center
    justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

      {/* ---------#left side-------- */}
      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]'/>


      {/* ---------#right side--------- */}

      {/*Login form : */}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex
      flex-col gap-6 rounded-lg shadow-lg'>
      
      {/* form will have onsubmithandler function for submiiting the form  */}
        
        {/* for title: */}
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}

          {/* when data is submitted then only arrow icon will be displayed (in bio part) to again go to signup field: */}
          {isDataSubmitted && <img onClick={()=> setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" 
          className='w-5 cursor-pointer' />
          }
        </h2>  


          {/* for signup from : */}
          {currState === "Sign up" && !isDataSubmitted && (  // when the curr state is signup & data is not submiited  then only we will display this input field (not for login form):

             // NOTE : we will store these data in a state variable using onChange property :

             // input field for full name of the user before signup:
             <input onChange={(e) =>setFullName(e.target.value)} value={fullName}
             type="text" className='p-2 border border-gray-500 rounded-md
             focus:outline-none' placeholder='Full Name' required />          
          )}

          {/*  */}

          {!isDataSubmitted && ( // we will display this when the data is not submittted :
            
            // returning fragment for emial & password :
            <>
              {/* for user email id : */}
              <input onChange={(e) =>setEmail(e.target.value)} value={email}
              type="email"  placeholder='Email Address' required className='p-2
              border border-gray-500 rounded-md focus:outline-none focus:ring-2 
              focus:ring-indigo-500'/>
            
              {/* for user password: */}
              <input onChange={(e) =>setPassword(e.target.value)} value={password}
              type="password"  placeholder='Password' required className='p-2
              border border-gray-500 rounded-md focus:outline-none focus:ring-2 
              focus:ring-indigo-500'/>            
            </>

          )}

          {/* for user bio : */}

          {
            currState === "Sign up" && isDataSubmitted && (  // this text area will be displayed when the curr state is signup & data is submiited :
              <textarea onChange={(e)=> setBio(e.target.value)} value={bio}
              rows={4} className='p-2 border border-gray-500 rounded-md
              focus:outline-none focus:ring-2 focus:ring-indigo-500' 
              placeholder='provide a short bio....' required>
              </textarea>
            )
          }

          {/* submit button => (for both login & signup) : */}
          <button  type='submit' className='py-3 bg-gradient-to-r from-purple-400
          to-violet-600 text-white rounded-md cursor-pointer'>
            {currState === "Sign up" ? "Create Account" : "Login Now"}
          </button>

          {/* div for privacy policy text & checkbox: */}
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <input type="checkbox" />
            <p>Agree to the terms of use & privacy policy.</p>
          </div>

          {/* div for switching between login /sign up form: */}
          <div className='flex flex-col gap-2'>
            {currState === "Sign up" ? ( // if the curr state is signup & want to switch to login :
              <p className='text-sm text-gray-600'>Already have an acoount?  
              
              {/* span tag for switching(change the state variable) with onclick property : */}
              <span onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}} 
              className='font-medium text-violet-500 cursor-pointer'>Login here
              </span>
              </p>

            ) : ( // if curr state is login & want to switch to signup:
              
              // if user don't have any account :
              <p className='text-sm text-gray-600'>Create an account

               {/* span tag for switching with onclick property: */}
              <span onClick={()=>setCurrState("Sign up")} className='font-medium text-violet-500 cursor-pointer'>Click here
              </span> 
              </p>

            )}

          </div>

      </form>

    </div>
  )
}

export default LoginPage
