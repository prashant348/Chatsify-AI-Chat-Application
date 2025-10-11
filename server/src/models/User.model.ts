import mongoose, { mongo } from "mongoose";

const ReceiverFriendSchema = new mongoose.Schema({
    receiverId: { type: String, required: true },
    receiverUsername: { type: String, required: true },
    sentAt: { type: Date, default: Date.now }
})

const SenderFriendSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
    senderUsername: { type: String, required: true },
    senderAvatar: { type: String, required: true },
    receivedAt: { type: Date, default: Date.now }
})

const FriendsSchema = new mongoose.Schema({
    friendClerkId: { type: String, required: true },
    friendUsername: { type: String, required: true },
    friendAvatar: { type: String, required: true }
})

const UserSchema = new mongoose.Schema({
    clerkUserId: { type: String, unique: true, required: true, sparse: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    avatar: { type: String }, 
    friends: { type: [FriendsSchema] },
    friendRequestsSentTo: { type: [ReceiverFriendSchema] },
    friendRequestsReceivedFrom: { type: [SenderFriendSchema] }
})

// const UserSchema = new mongoose.Schema({
//     senderId: { type: String, unique: true, required: true },
//     receiverId: { type: String, unique: true, required: true },
// })

export const User = mongoose.model("User", UserSchema)