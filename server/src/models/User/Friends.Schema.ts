import mongoose from "mongoose"
import { MessageSchema } from "./Message.Schema.js"

export const FriendsSchema = new mongoose.Schema({
    friendClerkId: { type: String, required: true },
    friendUsername: { type: String, required: true },
    friendAvatar: { type: String, required: true },
    messages:  { type: [MessageSchema] }
})