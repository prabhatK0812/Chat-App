// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

//
import { BrowserRouter } from 'react-router-dom'

// for adding context support
import { AuthProvider } from '../context/AuthContext.jsx'
import { ChatProvider } from '../context/ChatContext.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,

  <BrowserRouter>

    <AuthProvider>

      <ChatProvider>
         <App />
      </ChatProvider>
      
    </AuthProvider>
    
  </BrowserRouter>,

)
