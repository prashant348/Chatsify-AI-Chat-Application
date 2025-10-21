import express from "express"
import { clerkMiddleware } from "@clerk/express"
import { getAuth } from "@clerk/express"
import { User } from "../models/User.model"

const router = express.Router()
router.use(clerkMiddleware())

// router.post("/api/:userid/send-to-chatbot", async (req, res) => {
//     try {
//         const { userid } = req.params
//         console.log("params: ", userid)

//         const { userId } = getAuth(req)
//         console.log("getAuth: ", userId)

//         const { message } = req.body
//         console.log("body", message)

//         const user = await User.findOne({ clerkUserId: userid })

//         if (!user) return res.status(404).json({ message: "user(you) not found!" })


//         const flaskRes = await fetch("http://127.0.0.1:5001/send", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ prompt: message }), // JSON format mai bhejna zaruri hai
//         })

//         const flaskData = await flaskRes.json()
//         console.log(flaskData)

//         user.chatbotChats.push({
//             you: message,
//             bot: flaskData.reply
//         })

//         await user.save()
//         console.log("chat saved in db")
//         res.status(201).json({ flaskData })
//         console.log("res sent at http://127.0.0.1:5001/send")
//     } catch (err) {
//         console.error("--error in sending to chatbot: ", err)
//         res.status(500).json({ message: err })
//     }
// })

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

