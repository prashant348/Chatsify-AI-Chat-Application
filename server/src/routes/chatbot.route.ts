import express from "express"
import { clerkMiddleware } from "@clerk/express"
import { getAuth } from "@clerk/express"
import { User } from "../models/User/User.model"

const router = express.Router()
router.use(clerkMiddleware())

router.get("/api/:userid/chatbot-chats", async (req, res) => {
    try {
        const { userid } = req.params
        console.log("params: ", userid)

        const { userId } = getAuth(req)
        console.log("getAuth: ", userId)

        const user = await User.findOne({ clerkUserId: userid })

        if (!user) return res.status(404).json({ message: "user(you) not found!" })

        const chats = user.chatbotChats
        res.status(200).json({ chatbotChats: chats })

        console.log("--chatbot chats fetched!")

    } catch (err) {
        console.error("--err in fetching chatbot chats: ", err)
        res.status(500).json({ message: err })
    }
})

export default router

