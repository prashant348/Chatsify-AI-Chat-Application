import { Server as ioServer } from "socket.io";
import { Socket } from "socket.io";
import { registerChatbotHandlers } from "./chatbot.socket";
import { registerChatHandlers } from "./one-on-one-chat.socket";
import { registerUserStatusHandlers } from "./userStatus.socket";
import { registerTextToSpeechHandlers } from "./text-to-speech.socket";


import { User } from "../models/User/User.model";
import { FriendsSchema } from "../models/User/Friends.Schema";


export const registerSocketHandlers = (io: ioServer) => {
    try {
        io.on("connection", (socket: Socket) => {
            console.log("User connected: ", socket.id)
            const userId = socket.handshake.query.userId as string
            socket.join(userId)
            registerTextToSpeechHandlers(io, socket, userId)
            // chat with chatbot logic
            registerChatbotHandlers(io, socket, userId)
            // one on one chat logic
            registerChatHandlers(io, socket)
            // online/offline status logic
            registerUserStatusHandlers(io, socket)
            socket.on("disconnect", () => {
                console.log("User disconnected: ", socket.id)
            })
        })
    } catch (err) {
        console.error("error from socket handler: ", err)
    }
}
