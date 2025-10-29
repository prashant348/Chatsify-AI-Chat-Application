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


router.delete("/api/:userid/delete-chatbot-chats", async (req, res) => {
    try {
        const { userid } = req.params
        console.log("params: ", userid)

        const you = await User.findOne({ clerkUserId: userid })

        if (!you) return res.status(404).json({ message: "user(you) not found!" })

        await User.updateOne(
            { clerkUserId: userid },
            {
                $set: {
                    chatbotChats: []
                }
            }
        )

        res.status(200).json({ message: "you and your chatbot chats deleted!" })
        console.log("chatbots chat deleted!")

    } catch (err) {
        console.error("--err in deleting chatbot chats: ", err)
        res.status(500).json({ message: err })
    }
})

router.get("/api/:userid/request-made", async (req, res) => {
    try {
        const { userid } = req.params
        console.log("params: ", userid)

        const you = await User.findOne({ clerkUserId: userid })

        if (!you) return res.status(404).json({ message: "user(you) not found!" })

        const numberOfRequestsMade = you.requestsMade

        res.status(200).json({ requestsMade: numberOfRequestsMade })
        console.log("no. of req made: ", numberOfRequestsMade)
    } catch (err) {
        console.error("--error in request tracker: ", err)
        res.status(500).json({ message: err })
    }
})

// router.post("/api/:userid/save-text-to-speech-chats")

export default router

