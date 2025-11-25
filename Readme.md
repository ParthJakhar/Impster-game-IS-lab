# 🎭 Imposter Game

A lightweight multiplayer imposter-style word game where players try to identify the imposter among them through clever clues and strategic voting.

## 🌟 Overview

**Built with:**
- **Backend:** Flask + Flask-SocketIO (Python)
- **Frontend:** React + Vite + socket.io-client
- **Deployment:** Local Wi-Fi (no internet required)
- **Storage:** Fully in-memory (no database)

---

## 🚀 Features

- ✨ Real-time joining/leaving notifications
- 💬 Live chat system
- 🎮 Any player can start the game
- 🎲 Random word assignment (secret word vs imposter word)
- 🔄 Automatic round management
- 🗳️ Voting system with auto-elimination
- 🏆 Win conditions:
  - **Civilians win:** Imposter is eliminated
  - **Imposter wins:** Only 2 players remain

---

## 📁 Project Structure

```
project/
│
├── server/
│   ├── server.py
│   ├── words.py
│   └── requirements.txt
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
```

---

## 🔧 Installation

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

   **requirements.txt:**
   ```
   flask
   flask-socketio
   eventlet
   flask-cors
   ```

3. **Run the server:**
   ```bash
   python server.py
   ```
   
   Server starts at: `http://<YOUR_IP>:5050`

4. **Find your IP address:**
   - **Mac:** `ipconfig getifaddr en0`
   - **Windows:** `ipconfig`
   - **Linux:** `hostname -I`

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   Frontend runs at: `http://localhost:5173` (or your local IP)

4. **Configure server connection:**
   
   When you open the app, you'll see a "Server Configuration" screen if not connected.
   - Enter your server IP address (e.g., `http://192.168.1.100:5050`)
   - The URL will be saved in your browser for future use
   - Click "Connect" to establish connection
   
   **Optional:** You can also create a `.env` file in the `client/` directory:
   ```env
   VITE_SERVER_URL=http://<YOUR_IP>:5050
   ```

5. **Access on mobile devices:**
   
   Open: `http://<YOUR_IP>:5173` on any device on the same WiFi network
   - Each device will need to configure the server URL on first use
   - The URL is saved per device in browser localStorage

---

## 🎮 How to Play

### 1. Join Game
- Players join from laptops/phones
- Each player enters their name
- See real-time player list and chat

### 2. Start Game
- Any player presses **Start Game**
- Server randomly:
  - Picks a secret word
  - Picks a related imposter word
  - Assigns one player as the imposter
  - Sends words individually to players

### 3. Give Clues
- Each player types one clue about their word
- Clues are visible to all players
- Try to identify the imposter without being too obvious!

### 4. Vote
- Voting screen appears
- Everyone votes for who they think is the imposter
- Player with most votes is eliminated

### 5. Win Conditions
- **Civilians win:** If the imposter is eliminated
- **Imposter wins:** If only 2 players remain
- Game automatically resets after each round

---

## ⚠️ Troubleshooting

### ❌ Phone shows "Disconnected"

**Fix:**
- Ensure phone and laptop are on the **same Wi-Fi network**
- Enter the correct server IP in the "Server Configuration" screen
- Make sure the server is running (`python server.py` in the server directory)
- Check that the server IP is correct (use `ipconfig` on Windows or `ifconfig` on Mac/Linux)
- Disable VPN if active
- Try refreshing the page after entering the server URL

### ❌ Chat/messages/voting not showing

**Check:**
- Correct socket import:
  ```javascript
  import { io } from "socket.io-client";
  ```
- Using singleton socket (no multiple connections)
- Correct `VITE_SERVER_URL` in `.env`
- Browser console for errors

### ❌ Words not appearing

**Fix:**
- Ensure `words.py` exists in `server/` directory
- Restart the server:
  ```bash
  python server.py
  ```
- Check server console for errors

### ❌ Connection issues

**Firewall:**
- Allow ports `5050` (backend) and `5173` (frontend)
- On Mac: System Preferences → Security & Privacy → Firewall
- On Windows: Windows Defender Firewall → Allow an app

---

## 🔌 Network Configuration

### Server
```
http://<YOUR_IP>:5050
```

### Client
```
http://<YOUR_IP>:5173
```

### Environment Variable
```env
VITE_SERVER_URL=http://<YOUR_IP>:5050
```

⚠️ **Important:** Replace `<YOUR_IP>` with your actual local IP address

---

## 📝 Game Rules

1. **Regular players** receive the secret word
2. **One imposter** receives a different but related word
3. Players give clues without being too obvious
4. Vote to eliminate suspected imposter
5. Imposter tries to blend in and survive
6. Last 2 standing = Imposter wins
7. Imposter eliminated = Civilians win

---

## 🛡️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Flask + Flask-SocketIO |
| Frontend | React 18 + Vite |
| Real-time | Socket.IO |
| Styling | CSS (customize as needed) |
| Server | Eventlet WSGI |

---

## 📱 Supported Devices

- ✅ Desktop browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome, Firefox)
- ✅ Tablets
- ✅ Any device on the same local network

---

## 🎨 Customization

### Add more words
Edit `server/words.py`:
```python
WORD_PAIRS = [
    ("cat", "dog"),
    ("coffee", "tea"),
    # Add your own pairs
]
```

### Change ports
- **Backend:** Modify `server.py` → `socketio.run(app, port=5050)`
- **Frontend:** Update `.env` file

---

## 📄 License

This project is open source. Feel free to modify and use for personal or educational purposes.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## 💡 Tips

- **Host tip:** Share your IP address with all players
- **Gameplay tip:** Keep clues subtle but not too vague
- **Performance tip:** Recommended 4-8 players for best experience

---

**Enjoy the game! 🎉**
