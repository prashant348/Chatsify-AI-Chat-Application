import { Socket } from "socket.io";
import { Server as ioServer } from "socket.io";
import { User } from "../models/User/User.model";

export const registerUserStatusHandlers = (io: ioServer, socket: Socket) => {
    try {
        // online/offline status logic
        socket.on("send-status", async ({ from, status }) => {
            console.log("from client: ", { from, status })

            const user = await User.findOne({ clerkUserId: from })
            if (!user) return
            // fetch all friends clerk id of the user
            const userFriendsId = user.friends.map(f => f.friendClerkId)
            console.log("userFriends: ", userFriendsId)
            // now send status to all friends
            for (const id of userFriendsId) {
                io.to(id).emit("receive-status", { from, status })
            }

            console.log("status sent!")
        })
    } catch (err) {
        console.error("error from user status handlers: ", err)
    }
}

