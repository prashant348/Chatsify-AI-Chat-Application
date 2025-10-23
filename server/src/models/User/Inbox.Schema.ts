import mongoose from "mongoose";

export const InboxSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    userAvatar: { type: String, required: true },
    msg: {type: String, required: true },
    receivedAt: { type: Date, default: Date.now }
})
