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
import chatMessageRouter from "./routes/chatMessage.route";
import chatbotRouter from "./routes/chatbot.route"
import { registerSocketHandlers } from "./sockets";

const app = express()
const PORT = process.env.PORT || 5000
// creating a node http server with express
const server = http.createServer(app)

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true
}))

app.use(express.json())
app.use("/", chatbotRouter)
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

registerSocketHandlers(io)

server.listen(PORT, async () => {
    await connectDB()
    console.log(`Server is running at http://localhost:${PORT}`)
})
