import express from "express";
import clerkClient from "@clerk/clerk-sdk-node";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        console.log(process.env.CLERK_SECRET_KEY)
        // automatically detect karega CLERK_SECRET_KEY from .env file
        const users = await clerkClient.users.getUserList()

        users.forEach(user => {
            console.log(user.username)
        })

        res.status(200).json(users)

    } catch (err) {
        console.error("error in fetching users", err)
        res.status(500).send(err)
    }
})

export default router