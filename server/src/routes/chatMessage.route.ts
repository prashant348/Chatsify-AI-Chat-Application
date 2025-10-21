import express from "express"
import { clerkMiddleware } from "@clerk/express"
import { getAuth } from "@clerk/express"
import { User } from "../models/User.model"

const router = express.Router()


router.get("/api/:userid/:friendid/chats", async (req, res) => {
    try {
        const { userid, friendid } = req.params
        const user = await User.findOne({ clerkUserId: userid })
        const friend = await User.findOne({ clerkUserId: friendid })
        if (!user || !friend) {
            res.status(404).json({ message: "user(you) or friend not found!" })
            return
        }
        const friendEntry = user.friends.find(f => f.friendClerkId === friendid)
        const chats = friendEntry?.messages ?? []
        res.status(200).json({ chats })
    } catch (err) {
        console.error("error in fetching messages: ", err)
        res.status(500).json({ message: err })
    }
})

export default router