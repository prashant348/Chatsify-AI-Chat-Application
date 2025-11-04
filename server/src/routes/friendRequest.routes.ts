import express from "express";
import { User } from "../models/User/User.model.js";
import { getAuth } from "@clerk/express";
import { clerkMiddleware } from "@clerk/express";

const router = express.Router()
router.use(clerkMiddleware())

router.get("/api/:userid/friends", async (req, res) => {
    try {
        const { userid } = req.params
        // get clerk user id of currently signed in user
        const { userId } = getAuth(req)
        // check if user exists
        const user = await User.findOne({ clerkUserId: userId })

        // if not 
        if (!user) {
            res.status(404).json({ message: "user(you) not found!" })
            return
        }

        // if yes, then fetch all the friends of this user from its friends[] field
        const userFriends = user.friends.map((friend) => {
            return friend
        })

        // success reponse - showing all friends of the user at this end point for rendering them on frontend!
        res.status(200).json({ userFriends: userFriends })
        // for debugging    
    } catch (err) {
        console.error("error in fetching friends: ", err)
        res.status(500).json({ message: err })
    }
})

router.post("/api/send-request", async (req, res) => {
    try {
        // data received from frontend
        const { senderId, senderUsername, senderEmail, senderAvatar, receiverId, receiverUsername } = req.body
        // check if sender and receiver exist 
        const sender = await User.findOne({ clerkUserId: senderId })
        const receiver = await User.findOne({ clerkUserId: receiverId })
        // if sender and receiver both exist then...
        if (sender && receiver) {

            // ...check if receiver already got an friend req from this sender
            const receiverReq = sender.friendRequestsSentTo.find((receiverFriend) => {
                return receiverFriend.receiverId === receiverId
            })

            // if yes, then show "req already sent" and return
            if (receiverReq) {
                res.status(409).json({ message: "Request already sent!" })
                console.log("req already sent!")
                return
            }


            // check if both are already friends by finding sender's username in receiver's friends[] field
            const friendsMoment = receiver.friends.find((senderFriend) => {
                return senderFriend.friendUsername === senderUsername
            })

            // if already friends!
            if (friendsMoment) {
                res.status(409).json({ message: "Already friends!" })
                console.log("already friends!") // for debugging
                return
            }

            // if none of the above, then send the request by updating the obj doc of this sender and receiver and then return
            sender.friendRequestsSentTo.push({ receiverId: receiverId, receiverUsername: receiverUsername })
            receiver.friendRequestsReceivedFrom.push({ senderId: senderId, senderUsername: senderUsername, senderAvatar: senderAvatar })

            // save changes
            await sender.save()
            await receiver.save()

            // success response
            res.status(201).json({ message: "Request sent!" })
            return
        }

        // if one of them or both dont exists
        res.status(404).json({ message: "sender or receiver not found!" })

    } catch (err) {
        console.error("error in sending friend req: ", err)
        res.status(500).json({ message: err })
    }
})

router.get("/api/receive-request", async (req, res) => {
    try {
        // get the userid of receiver
        const { userId } = getAuth(req)
        // check if receiver exists
        const receiver = await User.findOne({ clerkUserId: userId })
        // no need but still for safety!
        if (!receiver) {
            res.status(404).json({ message: "user not found!" })
            return
        }
        // fetch all received friend requests
        const friendRequests = receiver.friendRequestsReceivedFrom
        // success response 
        res.status(200).json({ receiverId: userId, friendRequestsReceivedFrom_List: friendRequests })
    } catch (err) {
        console.error("error in receiving req: ", err)
        res.status(500).json({ message: err })
    }
})

router.post("/api/accept-request", async (req, res) => {
    try {
        // data received from frontend
        const { senderUsername, senderAvatar, senderId } = req.body
        // get receiver's clerk id using getAuth() and clerkMiddleware()
        const { userId } = getAuth(req)
        // for debugging 
        // check if sender and receiver exist
        const sender = await User.findOne({ clerkUserId: senderId })
        const receiver = await User.findOne({ clerkUserId: userId })

        // if sender not exists
        // InCase: if user A sent friend req to user B and before user B accepts it, user A already deleted his account
        if (!sender) {
            res.status(404).json({ message: "sender not found!" })
            return
        }

        // Obviously receiver will accept req only if he/she exists but still these lines added for safety purposes!
        if (!receiver) {
            res.status(404).json({ message: "receiver not found!" })
            return
        }

        // check if sender already has receiver as friend
        const friendAlreadyExistsInSenderFriendsList = sender.friends.find((friend) => {
            return friend.friendUsername === receiver.username
        })

        // if yes, then display "friend already exists!" msg
        if (friendAlreadyExistsInSenderFriendsList) {
            console.log("friend already exists!")
            res.status(409).json({ message: "friend already exists in sender friends list!" })
            return
        }

        // check if receiver already has sender as friend
        const friendAlreadyExistsInReceiverFriendsList = receiver.friends.find((friend) => {
            return friend.friendUsername === senderUsername
        })

        // if yes, then display same msg
        if (friendAlreadyExistsInReceiverFriendsList) {
            console.log("friend already exists!")
            res.status(409).json({ message: "friend already exists in receiver friends list!" })
            return
        }
        // if not, then make them friend! by adding each others detail in their friends[] field...
        sender.friends.push({
            friendClerkId: userId,
            friendUsername: receiver.username,
            friendAvatar: receiver.avatar
        })

        receiver.friends.push({
            friendClerkId: senderId,
            friendUsername: senderUsername,
            friendAvatar: senderAvatar
        })
        // ...and add a msg in sender's inbox about receiver (you) accepted the friend request 
        sender.inbox.push({
            userId: userId,
            username: receiver.username,
            msg: "Accepted your friend request!",
            userAvatar: receiver.avatar
        })

        // save changes
        await sender.save()
        await receiver.save()
        // also after making them friend delete friend request from both
        await User.updateOne({ clerkUserId: senderId }, { $pull: { friendRequestsSentTo: { receiverId: userId } } })
        await User.updateOne({ clerkUserId: userId }, { $pull: { friendRequestsReceivedFrom: { senderId: sender.clerkUserId } } })
        res.status(201).json({ message: "req accepted!" })
    } catch (err) {
        console.error("err in accepting req: ", err)
        res.status(500).json({ message: err })
    }
})

router.delete("/api/reject-request", async (req, res) => {
    try {

        // receiving data from frontend!
        const { senderId, receiverId } = req.body
        // check if sender and receiver both exist!
        const sender = await User.findOne({ clerkUserId: senderId })
        const receiver = await User.findOne({ clerkUserId: receiverId })

        //  if both exist...
        if (sender && receiver) {

            // ...then check for req is deleted or not in both sender and receiver:
            const reqNotDeletedInSender = sender.friendRequestsSentTo.find((reqSent) => {
                return reqSent.receiverId === receiverId
            })

            const reqNotDeletedInReceiver = receiver.friendRequestsReceivedFrom.find((reqReceived) => {
                return reqReceived.senderId === senderId
            })

            const reqAlreadyDeleted = !reqNotDeletedInSender || !reqNotDeletedInReceiver

            // if there is no req, means dont exists, means already deleted
            if (reqAlreadyDeleted) {
                console.log("req already rejected!")
                res.status(409).json({ message: "req already rejected!" })
                return
            }

            // if there is req, delete the pending req from sender's friendRequestsSentTo[] field
            await User.updateOne(
                { clerkUserId: senderId },
                {
                    $pull: {
                        friendRequestsSentTo: { receiverId: receiverId }
                    }
                }
            )

            // and also delete from receiver's friendRequestsReceivedFrom[] field
            await User.updateOne(
                { clerkUserId: receiverId },
                {
                    $pull: {
                        friendRequestsReceivedFrom: { senderId: senderId }
                    }
                }
            )

            // ...and add a msg in sender's inbox about receiver (you) rejected the friend request 
            sender.inbox.push({
                userId: receiver.clerkUserId,
                username: receiver.username,
                msg: "Rejected your friend request!",
                userAvatar: receiver.avatar
            })

            await sender.save()

            // give success response of deleting pending friend request
            res.status(200).json({ message: "req rejected!" })
            return
        }

        // if one of them not exist
        res.status(404).json({ message: "sender or receiver not found!" })

    } catch (err) {
        console.error("error in rejecting request: ", err)
        res.status(500).json({ message: err })
    }
})

router.get("/api/:userid/inbox", async (req, res) => {
    try {
        const { userid } = req.params
        const user = await User.findOne({ clerkUserId: userid })
        if (!user) {
            res.status(404).json({ message: "user(you) not found!" })
            return
        }
        res.status(200).json({ inbox: user.inbox })
    } catch (err) {
        console.error("error in fetching inbox msgs: ", err)
        res.status(500).json({ message: err })
    }
})

router.delete("/api/:userid/inbox", async (req, res) => {
    try {
        const { userid } = req.params
        const { userId, receivedAt } = req.body
        const userToDeleteId = userId
        const user = await User.findOne({ clerkUserId: userid })
        if (!user) {
            res.status(404).json({ message: "user(you) not found!" })
            return
        }

        await User.updateOne(
            { clerkUserId: userid },
            {
                $pull: {
                    inbox: { userId: userToDeleteId, receivedAt: receivedAt }
                }
            }
        )

        res.status(200).json({ inbox: user.inbox })
    } catch (err) {
        console.error("error in deleting inbox msgs: ", err)
        res.status(500).json({ message: err })
    }
})

router.delete("/api/:userid/remove-friend", async (req, res) => {
    try {
        const { friendId } = req.body
        const { userid } = req.params
        const user = await User.findOne({ clerkUserId: userid })
        const friend = await User.findOne({ clerkUserId: friendId })
        console.log("you: ", userid, " friend: ", friendId)
        if (!user || !friend) {
            res.status(404).json({ message: "user(you) or friend not found!" })
            return
        }

        await User.updateOne(
            { clerkUserId: userid },
            {
                $pull: {
                    friends: { friendClerkId: friendId }
                }
            }
        )

        await User.updateOne(
            { clerkUserId: friendId },
            {
                $pull: {
                    friends: { friendClerkId: userid }
                }
            }
        )
        res.status(200).json({ friends: user.friends })
        console.log("friend removed!")
    } catch (err) {
        console.log("error in removing friend: ", err)
        res.status(500).json({ message: err })
    }
})

export default router