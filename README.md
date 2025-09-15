📱💬 REAL-TIME CHAT APPLICATION 💬📱
<p align="center"> A modern and scalable real-time chat platform built with MERN Stack, Socket.io, and JWT authentication. Supports one-to-one and group chats with text, media, and file sharing features. </p>
✨ Features

🔐 Secure login & authentication with JWT

💬 Real-time chat using Socket.io

👥 Group chat creation & management

📂 Image & file sharing with Cloudinary

🎨 Modern, responsive UI built with React + TailwindCSS

☁️ Cloud storage integration

🛠️ Tech Stack

Frontend: React, TailwindCSS

Backend: Node.js, Express.js

Database: PostgreSQL

Authentication: JWT

Cloud & Storage: Cloudinary

Real-time Communication: Socket.io

⚡ Getting Started
1️⃣ Clone the Repository
git clone https://github.com/username/quickchat.git
cd quickchat

2️⃣ Backend Setup
cd server
npm install


Create .env file in server/:

PORT=5000
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


Run backend server:

npm run dev

3️⃣ Frontend Setup
cd client
npm install


Create .env file in client/:

VITE_BASE_URL=http://localhost:5000


Run frontend server:

npm run dev


📍 Frontend: http://localhost:5173

📍 Backend: http://localhost:5000

🎯 Usage

Register/Login with secure authentication.

Start private chats or create group chats.

Share text, images, and files in real-time.

Manage chats across devices with persistent sessions.

📸 Screenshots

(Add some UI screenshots here: Chat UI, Group chat, File sharing)

🚀 Future Enhancements

📞 Voice & video calls

👀 Online/offline status indicator

✅ Message read receipts & reactions

🔒 End-to-end encryption
