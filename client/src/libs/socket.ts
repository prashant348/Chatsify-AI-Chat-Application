import { io, Socket } from "socket.io-client";

// Get server URL from environment variable
const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// first create a socket
export const socket: Socket = io(SERVER_URL, {
    autoConnect: false,
    transports: ["websocket", "polling"], // both needed for production
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    timeout: 2000
})

// then create functions to connect and disconnect socket
export const connectSocket = () => socket.connect()
export const disconnectSocket = () => socket.disconnect()

