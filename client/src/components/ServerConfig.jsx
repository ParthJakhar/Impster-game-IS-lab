import React, { useState, useEffect } from "react";
import { reconnectToServer, getCurrentServerUrl, getSocket } from "../socket";

export default function ServerConfig({ onConnected }) {
  const [serverUrl, setServerUrl] = useState(getCurrentServerUrl());
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Load saved URL from localStorage
    const saved = localStorage.getItem("server_url");
    if (saved) {
      setServerUrl(saved);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = serverUrl.trim();
    if (!trimmed) return;

    // Validate URL format
    try {
      new URL(trimmed);
    } catch {
      alert("Please enter a valid URL (e.g., http://192.168.1.100:5050)");
      return;
    }

    setIsConnecting(true);
    
    try {
      // Reconnect with new URL
      reconnectToServer(trimmed);
      const newSocket = getSocket();
      
      // Wait a moment for connection attempt
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if connected
      if (newSocket.connected) {
        setIsConnecting(false);
        if (onConnected) onConnected();
      } else {
        // Set up a one-time connect listener
        const checkConnection = () => {
          setIsConnecting(false);
          if (onConnected) onConnected();
        };
        
        const handleError = (error) => {
          setIsConnecting(false);
          alert(`Connection failed: ${error.message || "Could not connect to server"}\n\nMake sure:\n- Server is running\n- You're on the same WiFi\n- IP address is correct`);
          newSocket.off("connect", checkConnection);
          newSocket.off("connect_error", handleError);
        };
        
        newSocket.once("connect", checkConnection);
        newSocket.once("connect_error", handleError);
        
        // Timeout after 5 seconds
        setTimeout(() => {
          if (!newSocket.connected) {
            setIsConnecting(false);
            newSocket.off("connect", checkConnection);
            newSocket.off("connect_error", handleError);
            alert("Connection timeout. Please check the server URL and ensure the server is running.");
          }
        }, 5000);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
      setIsConnecting(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "50vh",
      padding: "20px"
    }}>
      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        maxWidth: "400px",
        padding: "24px",
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <h2 style={{ margin: "0 0 8px 0", textAlign: "center" }}>Server Configuration</h2>
        <p style={{ 
          margin: "0 0 16px 0", 
          fontSize: "14px", 
          color: "rgba(255, 255, 255, 0.7)",
          textAlign: "center"
        }}>
          Enter the server IP address to connect
        </p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.8)" }}>
            Server URL:
          </label>
          <input
            type="text"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            placeholder="http://192.168.1.100:5050"
            disabled={isConnecting}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              background: "rgba(0, 0, 0, 0.3)",
              color: "white",
              fontSize: "16px",
              outline: "none"
            }}
          />
        </div>
        
        <button
          type="submit"
          disabled={isConnecting || !serverUrl.trim()}
          style={{
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
            background: isConnecting ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)",
            color: "white",
            fontSize: "16px",
            cursor: isConnecting ? "not-allowed" : "pointer",
            fontWeight: "500"
          }}
        >
          {isConnecting ? "Connecting..." : "Connect"}
        </button>
        
        <div style={{
          marginTop: "16px",
          padding: "12px",
          background: "rgba(255, 255, 255, 0.03)",
          borderRadius: "8px",
          fontSize: "12px",
          color: "rgba(255, 255, 255, 0.6)"
        }}>
          <strong>Tip:</strong> Find your server IP by running <code style={{background: "rgba(0,0,0,0.3)", padding: "2px 4px", borderRadius: "4px"}}>ipconfig</code> on Windows or <code style={{background: "rgba(0,0,0,0.3)", padding: "2px 4px", borderRadius: "4px"}}>ifconfig</code> on Mac/Linux. Use format: <code style={{background: "rgba(0,0,0,0.3)", padding: "2px 4px", borderRadius: "4px"}}>http://YOUR_IP:5050</code>
        </div>
      </form>
    </div>
  );
}

