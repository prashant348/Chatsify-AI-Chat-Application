import dotenv from "dotenv"
dotenv.config()
import express from "express";
import type { Request, Response } from "express";
import cors from "cors"
import userRouter from "./routes/user.routes";
import { connectDB } from "./database/db";
import friendRequestRouter from "./routes/friendRequest.routes";

const app = express()
const PORT = process.env.PORT || 3000


app.use(cors())   
app.use(express.json())
app.use("/", friendRequestRouter)
app.use("/", userRouter)

app.get("/", (req: Request, res: Response) => {
    res.json({ response: "hello world"})
})

app.listen(PORT, async () => {   
    await connectDB()
    console.log(`Server is running at http://localhost:${PORT}`)
})
   