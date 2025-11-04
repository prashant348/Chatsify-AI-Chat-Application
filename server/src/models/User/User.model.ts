import mongoose from "mongoose";

import { ReceiverFriendSchema } from "./ReceiverFriend.Schema.js";
import { SenderFriendSchema } from "./SenderFriend.Schema.js";
import { FriendsSchema } from "./Friends.Schema.js";
import { InboxSchema } from "./Inbox.Schema.js";
import { ChatbotSchema } from "./Chatbot.Schema.js";
import { TextToSpeechAISchema } from "./TextToSpeechAI.Schema.js";

const UserSchema = new mongoose.Schema({
    clerkUserId: { type: String, unique: true, required: true, sparse: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    avatar: { type: String }, 
    friends: { type: [FriendsSchema] },
    friendRequestsSentTo: { type: [ReceiverFriendSchema] },
    friendRequestsReceivedFrom: { type: [SenderFriendSchema] },
    inbox: { type: [InboxSchema] },
    chatbotChats: { type: [ChatbotSchema]},
    textToSpeechAIChats: { type: [TextToSpeechAISchema]},
    requestsMade: { type: Number, default: 0 }
})


export const User = mongoose.model("User", UserSchema)