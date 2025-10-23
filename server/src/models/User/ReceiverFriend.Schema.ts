import mongoose from "mongoose";

export const ReceiverFriendSchema = new mongoose.Schema({
    receiverId: { type: String, required: true },
    receiverUsername: { type: String, required: true },
    sentAt: { type: Date, default: Date.now }
})