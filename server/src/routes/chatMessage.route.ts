import express from "express"
import { clerkMiddleware } from "@clerk/express"
import { getAuth } from "@clerk/express"
import { User } from "../models/User/User.model"

const router = express.Router()
router.use(clerkMiddleware())

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


router.delete("/api/:userid/:friendid/delete-chats", async (req, res) => {
    try {
        const { userid, friendid } = req.params
        const { userId } = getAuth(req)
        const { yourId, friendId } = req.body

        const user = await User.findOne({ clerkUserId: userid })

        if (!user) return res.status(404).json({ message: "user(you) not found!" })

        const friend = user.friends.find(f => f.friendClerkId === friendid)

        if (!friend) return res.status(404).json({ message: "friend not found!" })


        await User.updateOne(
            { clerkUserId: userid, "friends.friendClerkId": friendid },
            {
                $set: {
                    "friends.$.messages": [] // here $ is positinal operator which depends on above "friends.friendClerkId": friendid 
                }
            }
        )

        res.status(200).json({ message: "chats deleted!" })

    } catch (err) {
        console.error("--error in deleting chats: ", err)
        res.status(500).json({ message: err })
    }
})

export default router