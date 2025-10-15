import dotenv from "dotenv"
dotenv.config()
import express from "express";
import type { Request, Response } from "express";
import cors from "cors"
import userRouter from "./routes/user.routes";
import { connectDB } from "./database/db";
import friendRequestRouter from "./routes/friendRequest.routes";
import http from "http"
import { Server as ioServer } from "socket.io";
import { Socket } from "socket.io";
import { User } from "./models/User.model";
import chatMessageRouter from "./routes/chatMessage.route";

const app = express()
const PORT = process.env.PORT || 5000
// creating a nodejs http server 
const server = http.createServer(app)

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use("/", chatMessageRouter)
app.use("/", friendRequestRouter)
app.use("/", userRouter)

app.get("/", (req: Request, res: Response) => {
    res.json({ response: "hello world" })
})

// creating a socket.io server
const io = new ioServer(server, {
    cors: { 
        origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
})

io.on("connection", (socket: Socket) => {
    console.log("user connected: ", socket.id)
    const userId = socket.handshake.query.userId as string
    console.log(userId)
    socket.join(userId)

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
        console.log("chat saved in sender and receiver db")

    })

    socket.on("disconnect", () => {
        console.log("user disconnected: ", socket.id) 
    })

})


server.listen(PORT, async () => {
    await connectDB()
    console.log(`Server is running at http://localhost:${PORT}`) 
})
