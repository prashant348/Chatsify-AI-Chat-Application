import mongoose from "mongoose"

export const MessageSchema = new mongoose.Schema({
    msg: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    type: { type: String, required: true }
})