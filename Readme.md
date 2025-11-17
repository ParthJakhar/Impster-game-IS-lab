📌 Imposter Game — README
A lightweight multiplayer imposter-style word game, built with:
Flask + Flask-SocketIO (Python backend)
React + Vite + socket.io-client (Frontend)
Works over local Wi-Fi — no internet required
No database, fully in-memory
🚀 Features
Real-time joining/leaving notifications
Real-time chat
Game start by any player
Random assignment of secret word vs imposter word
Automatic round management
Voting system
Auto-elimination of highest-voted player
Game ends when:
Imposter is eliminated, or
Only 2 players remain
🛠 Folder Structure
project/
│
├── server/
│   ├── server.py
│   ├── words.py
│   ├── requirements.txt
│
└── client/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx
        ├── socket.js
        ├── index.css
        └── main.jsx
🔧 Backend Setup (Flask + SocketIO)
1. Install dependencies
cd server
pip install -r requirements.txt
If you don’t have the file, create:
requirements.txt
flask
flask-socketio
eventlet
flask-cors
2. Run the server
python server.py
Server starts at:
http://<your-laptop-ip>:5050
To get IP:
Mac:
ipconfig getifaddr en0
Windows:
ipconfig
Linux:
hostname -I
🌐 Frontend Setup (React + Vite)
1. Install dependencies
cd client
npm install
2. Start the dev server
npm run dev
You’ll see something like:
http://localhost:5173
⭐ ON PHONE, open:
http://<your-laptop-ip>:5173
🔌 Connecting Frontend → Backend
Inside client/.env:
VITE_SERVER_URL=http://<your-laptop-ip>:5050
(Must match server IP exactly)
🎮 Full Game Flow
Players join from laptop/phones
Each enters a name
Everyone sees:
joined/left notifications
player list
chat
Any player presses Start Game
Server:
Picks random secret word
Picks related imposter word
Chooses one random player as imposter
Sends words individually
Players type one clue each
Voting screen appears
Everyone votes
Server eliminates top-voted player
If imposter eliminated → Civilians win
If only 2 remain → Imposter wins
Game resets automatically
⚠️ Troubleshooting
❌ Phone shows “Disconnected”
Fix:
Phone + laptop MUST be on same Wi-Fi
Use correct server IP in .env
Restart Vite after editing .env
Ensure no VPN is used
❌ Chat/messages/voting not showing
Check:
Correct import:
import { io } from "socket.io-client";
No multiple sockets (use singleton socket)
Correct server URL
❌ Words not appearing
Your backend must include words.py.
Restart server after editing.