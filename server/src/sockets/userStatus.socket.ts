import { Socket } from "socket.io";
import { Server as ioServer } from "socket.io";
import { User } from "../models/User/User.model";

export const registerUserStatusHandlers = (io: ioServer, socket: Socket) => {
    try {
        
        // NEW LOGIC OF COPILOT
        socket.on("join-room", async ({ userId }: { userId: string }) => {
            try {
                if (!userId) return;
                // join user's own room and store id on socket
                socket.join(userId);
                socket.data.userId = userId;

                // fetch user's friends
                const user = await User.findOne({ clerkUserId: userId });
                if (!user) return;
                const userFriendsId = user.friends.map(f => f.friendClerkId);

                // Notify all friends that this user is online
                for (const fid of userFriendsId) {
                    io.to(fid).emit("receive-status", { from: userId, status: "online" });
                }

                // Send initial statuses of friends who are currently online to the joining user
                const onlineFriends = userFriendsId.filter(fid => {
                    const room = io.sockets.adapter.rooms.get(fid);
                    return !!room && room.size > 0;
                });
                for (const fid of onlineFriends) {
                    socket.emit("receive-status", { from: fid, status: "online" });
                }

            } catch (err) {
                console.error("join-room error:", err);
            }
        });

        socket.on("send-status", async ({ from, status }) => {
            console.log("from client: ", { from, status });

            const user = await User.findOne({ clerkUserId: from });
            if (!user) return;
            // fetch all friends clerk id of the user
            const userFriendsId = user.friends.map(f => f.friendClerkId);
            console.log("userFriends: ", userFriendsId);
            // now send status to all friends
            for (const id of userFriendsId) {
                io.to(id).emit("receive-status", { from, status });
            }

            console.log("status sent!");
        });

        socket.on("disconnect", async () => {
            try {
                const from = socket.data.userId as string | undefined;
                if (!from) return;
                const user = await User.findOne({ clerkUserId: from });
                if (!user) return;
                const userFriendsId = user.friends.map(f => f.friendClerkId);
                for (const id of userFriendsId) {
                    io.to(id).emit("receive-status", { from, status: "" });
                }
            } catch (err) {
                console.error("disconnect status notify error:", err);
            }
        });


        // OLD LOGIC OF MINE
        // socket.on("send-status", async ({ from, status }) => {
        //     console.log("from client: ", { from, status })

        //     const user = await User.findOne({ clerkUserId: from })
        //     if (!user) return
        //     // fetch all friends clerk id of the user
        //     const userFriendsId = user.friends.map(f => f.friendClerkId)
        //     console.log("userFriends: ", userFriendsId)
        //     // now send status to all friends
        //     for (const id of userFriendsId) {
        //         io.to(id).emit("receive-status", { from, status })
        //     }

        //     console.log("status sent!")
        // })

    } catch (err) {
        console.error("error from user status handlers: ", err)
    }
}

