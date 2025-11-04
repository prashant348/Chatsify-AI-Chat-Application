import { Socket } from "socket.io";
import { Server as ioServer } from "socket.io";
import { User } from "../models/User/User.model.js";


export const registerChatHandlers = (io: ioServer, socket: Socket) => {
    try {
        
        socket.on("private-message", async ({ to, message, from }) => {
            console.log(`📩 Message from ${from} to ${to}: ${message}`);
            io.to(to).emit("receive-message", { message, from })

            const sender = await User.findOne({ clerkUserId: from })
            const receiver = await User.findOne({ clerkUserId: to })

            if (!sender || !receiver) {
                console.log("sender or receiver not found!")
                return
            }

            sender.friends.find(friend => {
                if (friend.friendClerkId === to) {
                    friend.messages.push({
                        msg: message,
                        type: "sent"
                    })
                }
            })

            receiver.friends.find(friend => {
                if (friend.friendClerkId === from) {
                    friend.messages.push({
                        msg: message,
                        type: "received"
                    })
                }
            })

            await sender.save()
            await receiver.save()
            console.log("sent")
            console.log("chat saved in sender and receiver db")

        })
    } catch (err) {
        console.error("error from chat handlers: ", err)
    }
}

