import { io, Socket } from "socket.io-client";

// pehele socket banao!


export const socket: Socket = io("http://localhost:5000", {
    autoConnect: false,
    transports: ["websocket"],

})

export const connectSocket = () => socket.connect()

export const disconnectSocket = () => socket.disconnect()

