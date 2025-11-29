import dotenv from "dotenv"
dotenv.config()
import express from "express";
import type { ErrorRequestHandler, Request, Response } from "express";
import cors from "cors"
import userRouter from "./routes/user.routes.js";
import { connectDB } from "./database/db.js";
import friendRequestRouter from "./routes/friendRequest.routes.js";
import http from "http"
import { Server as ioServer } from "socket.io";
import chatMessageRouter from "./routes/chatMessage.route.js";
import chatbotRouter from "./routes/chatbot.route.js"
import textToSpeechAIRouter from "./routes/text-to-speech-ai.route.js"
import { registerSocketHandlers } from "./sockets/index.js";
import path from "path";
import compression from "compression"
import { error } from "console";

const app = express()
const PORT = process.env.PORT || 5000
// creating a node http server with express
const server = http.createServer(app)
// __dirname is not defined in ES modules scope so we need to use path.resolve() to get the absolute path of the current directory
const __dirname = path.resolve()
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
}));
app.use(compression())
// middleware to serve static files in express
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())
app.use("/", textToSpeechAIRouter)
app.use("/", chatbotRouter)
app.use("/", chatMessageRouter)
app.use("/", friendRequestRouter)
app.use("/", userRouter)
app.use((err: any, _req: Request, res: Response, _next: any) => {
    console.error("Unhandled Error: ", err);
    res.status(err.status || 500).json({ message: err.message || "Server Error" })
})

app.get("/", (req: Request, res: Response) => {
    res.json({ response: "hello world" })
})

// creating a socket.io server
const io = new ioServer(server, {
    cors: {
        origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ["websocket"], 
    pingInterval: 25000,
    pingTimeout: 60000,
    allowEIO3: true,  // Backward compatibility
    path: "/socket.io"
})
app.set("trust proxy", 1)

registerSocketHandlers(io)

server.listen(PORT, async () => {
    await connectDB()
    console.log(`Server is running at http://localhost:${PORT}`)
})
