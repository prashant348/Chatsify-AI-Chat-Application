import express from "express"
import { clerkMiddleware } from "@clerk/express"
import { getAuth } from "@clerk/express"
import { User } from "../models/User/User.model.js"
import { supabaseAdmin } from "../libs/supabase.js"

const router = express.Router()
router.use(clerkMiddleware())

router.post("/api/delete-supabase-audios", async (req, res) => {
    try {
        const { userId } = req.body
        console.log(userId)

        if (!userId) return res.status(400).json({ error: "userId required" });

        const { data: files } = await supabaseAdmin.storage
            .from(process.env.SUPABASE_BUCKET_NAME!)
            .list(userId);

        console.log("------files: ", files)

        if (!files || files.length === 0) return res.json({ ok: true, deleted: [] });

        const paths = files.map(f => `${userId}/${f.name}`);

        const { error } = await supabaseAdmin.storage.from(process.env.SUPABASE_BUCKET_NAME!).remove(paths);

        if (error) throw error;

        return res.json({ ok: true, deleted: paths });

    } catch (err) {
        console.error("err in deleting supabase audios: ", err)
        res.status(500).json({ message: err })
    }
})

router.get("/api/:userid/text-to-speech-ai-chats", async (req, res) => {
    try {
        const { userid } = req.params
        console.log("params: ", userid)

        const { userId } = getAuth(req)
        console.log("getAuth: ", userId)

        const user = await User.findOne({ clerkUserId: userid })

        if (!user) return res.status(404).json({ message: "user(you) not found!" })

        const chats = user.textToSpeechAIChats
        res.status(200).json({ textToSpeechAIChats: chats })

        console.log("--text-to-speech-ai chats fetched!")

    } catch (err) {
        console.error("--err in fetching text-to-speech-ai chats: ", err)
        res.status(500).json({ message: err })
    }
})

router.delete("/api/:userid/delete-text-to-speech-ai-chats", async (req, res) => {
    try {
        const { userid } = req.params
        console.log("params: ", userid)

        const you = await User.findOne({ clerkUserId: userid })

        if (!you) return res.status(404).json({ message: "user(you) not found!" })

        await User.updateOne(
            { clerkUserId: userid },
            {
                $set: {
                    textToSpeechAIChats: []
                }
            }
        )

        res.status(200).json({ message: "you and your text-to-speech-ai chats deleted!" })
        console.log("text-to-speech-ai chat deleted!")

    } catch (err) {
        console.error("--err in deleting text-to-speech-ai chats: ", err)
        res.status(500).json({ message: err })
    }
})



export default router