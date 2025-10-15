import express from "express";
import clerkClient from "@clerk/clerk-sdk-node";
import { User } from "../models/User.model";
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { clerkMiddleware } from "@clerk/express";
import { getAuth } from "@clerk/express";
const router = express.Router();

router.use(clerkMiddleware()) 

router.get("/api/users", async (req, res) => {
    try { 
        // automatically detect karega CLERK_SECRET_KEY from .env file
        const users = await clerkClient.users.getUserList()
        res.status(200).json(users) 
    } catch (err) { 
        console.error("error in fetching users: ", err)
        res.status(500).send(err)
    }
}) 


router.post("/api/:userid", async (req, res) => {
    try {
        const userid = req.params.userid
        console.log(userid)
        const { clerkUserId, username, email, avatar } = req.body

        console.log({ 
            clerkUserId, username, email, avatar
        })
        
        const userExists = await User.findOne({ clerkUserId: userid })
        
        if (userExists) { 
            console.log("user already exists") 
            console.log(userExists)
            res.status(409).json({ message: "user already exists" })
            return
        }

        await User.create({ 
            clerkUserId: userid,
            username: username,
            email: email,
            avatar: avatar
        })
        
        res.status(201).json({ userInfo: { clerkUserId, username, email, avatar } })
        console.log("you created in db!")
    } catch(err) {
        console.error("Error in fetching you: ", err)
        res.status(500).send(err)
    }
})

router.get("/api/user/:username", async (req, res) => {
    try {
        const { username } = req.params

        const user = await User.findOne({ username: username })

        if (!user) return res.status(404).json({ message: "user not found" })

        const userId = user.clerkUserId
        res.status(200).json({ userId })

    } catch (err) {
        console.error("err in fetching user clerk id", err)
        res.status(500).json(err)
    }
})


export default router




