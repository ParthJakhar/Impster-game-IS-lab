import { io } from "socket.io-client";

// Get server URL from localStorage, env var, or default
function getServerUrl() {
  // Check localStorage first
  const stored = localStorage.getItem("server_url");
  if (stored) return stored;
  
  // Then check environment variable
  if (import.meta.env.VITE_SERVER_URL) {
    return import.meta.env.VITE_SERVER_URL;
  }
  
  // Default fallback
  return "http://localhost:5050";
}

// Create socket with current URL
let currentUrl = getServerUrl();
let socketInstance = io(currentUrl, {
  autoConnect: true,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 500,
});

// Function to reconnect with a new URL
export function reconnectToServer(newUrl) {
  if (socketInstance.connected) {
    socketInstance.disconnect();
  }
  
  // Store the new URL
  localStorage.setItem("server_url", newUrl);
  currentUrl = newUrl;
  
  // Create new socket instance
  socketInstance = io(newUrl, {
    autoConnect: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 500,
  });
  
  return socketInstance;
}

// Function to get current server URL
export function getCurrentServerUrl() {
  return currentUrl;
}

// Getter function to always return current socket instance
export function getSocket() {
  return socketInstance;
}

// Default export for backward compatibility
export default socketInstance;
