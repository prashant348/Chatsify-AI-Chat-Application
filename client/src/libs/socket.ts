import { io, Socket } from "socket.io-client";

// first create a socket
export const socket: Socket = io("http://localhost:5000", {
    autoConnect: false,
    transports: ["websocket"],

})

// then create functions to connect and disconnect socket
export const connectSocket = () => socket.connect()
export const disconnectSocket = () => socket.disconnect()

