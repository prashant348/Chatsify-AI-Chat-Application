import { Socket } from "socket.io";
import { Server as ioServer } from "socket.io";
import { User } from "../models/User/User.model.js";
import { generateResponse } from "../utils/generateResponse.js";
import { requestTracker } from "../utils/requestTracker.js";

export const registerChatbotHandlers = (
    io: ioServer, 
    socket: Socket, 
    userId: string
): void => {
    try {
        socket.on("send-msg-chatbot", async (prompt) => {
            // log the message from client
            console.log("from client: ", prompt)
            const requestsMade = await requestTracker(userId)
            if (requestsMade === "Error") return
            if (requestsMade >= 10) {
                console.log("Daily limit reached!")
                io.to(userId).emit("receive-limit-reached", "Daily limit reached!")
                return;
            }
            // generate response from AI
            const response = await generateResponse(prompt)

            // if not response then stop here
            if (!response || response === "Error generating response") return

            // after getting response from AI, send it to the client
            io.to(userId).emit("receive-msg-chatbot", response)

            // save you and bot msg in db
            const user = await User.findOne({ clerkUserId: userId })

            // if user (you) not found!
            if (!user) {
                console.log("user not found!")
                return
            }
            
            // if user (you) found!
            user.chatbotChats.push({
                you: prompt,
                bot: response
            })

            user.requestsMade += 1

            // save changes!
            await user.save()
            console.log("you and bot msg saved in db")
        })
    } catch (err) {
        console.error("error from chatbot handlers: ", err)
    }
}

