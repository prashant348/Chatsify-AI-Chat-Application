import mongoose from "mongoose";

export const ChatbotSchema = new mongoose.Schema({
    you: { type: String, required: true },
    bot: { type: String, required: true },
    receivedAt: { type: Date, default: Date.now }
})