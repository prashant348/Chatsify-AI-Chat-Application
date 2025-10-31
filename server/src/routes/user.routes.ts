import express from "express";
import clerkClient from "@clerk/clerk-sdk-node";
import { User } from "../models/User/User.model";

const router = express.Router();

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
        const { clerkUserId, username, email, avatar } = req.body
        const userExists = await User.findOne({ clerkUserId: userid })

        if (userExists) {

            if (userExists.username === username
                && userExists.avatar === avatar
            ) {
                console.log("user already exists")
                console.log(userExists)
                return res.status(409).json({ message: "user already exists" });
            } else {
                // first update yourself!
                userExists.username = username
                userExists.avatar = avatar
                await userExists.save()
                console.log("you updated successfully in your doc!")
                console.log({ clerkUserId, username, email, avatar })

                // now update update yourself in your friends data
                userExists.friends.map(async (friend) => {
                    // check if each friend of yours exist!
                    const friendExists = await User.findOne({ clerkUserId: friend.friendClerkId })
                    // if exist...
                    if (friendExists) {
                        // ...then find yourself in his/her friends list
                        friendExists.friends.map(async (friend) => {
                            // if found yourself...
                            if (friend.friendClerkId === userid) {
                                // ...then update yourself
                                friend.friendUsername = username
                                friend.friendAvatar = avatar
                                await friendExists.save()
                            }
                        })
                    }
                })
                console.log("you also updated successfully in your friends list!")
                return res.status(200).json({
                    message: "user updated successfully!",
                    updatedUserInfo: { clerkUserId: userid, username, email, avatar }
                })
            }

        }

        await User.create({
            clerkUserId: userid,
            username: username,
            email: email,
            avatar: avatar
        })

        res.status(201).json({ userInfo: { clerkUserId, username, email, avatar } })
        console.log("user (you) created in db!")
    } catch (err) {
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




