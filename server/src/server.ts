import dotenv from "dotenv"
dotenv.config()
import express from "express";
import type { Request, Response } from "express";
import cors from "cors"
import userRouter from "./routes/user.route";

const app = express()
const port = process.env.PORT || 3000

app.use(cors())   
app.use(express.json())
app.use("/api/users", userRouter)
 

app.get("/", (req: Request, res: Response) => {
    res.json({ response: "hello world"})
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
