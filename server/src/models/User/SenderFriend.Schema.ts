import mongoose from "mongoose"

export const SenderFriendSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
    senderUsername: { type: String, required: true },
    senderAvatar: { type: String, required: true },
    receivedAt: { type: Date, default: Date.now }
})