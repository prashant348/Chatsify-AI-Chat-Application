import mongoose from "mongoose";

import { ReceiverFriendSchema } from "./ReceiverFriend.Schema";
import { SenderFriendSchema } from "./SenderFriend.Schema";
import { FriendsSchema } from "./Friends.Schema";
import { InboxSchema } from "./Inbox.Schema";
import { ChatbotSchema } from "./Chatbot.Schema";

const UserSchema = new mongoose.Schema({
    clerkUserId: { type: String, unique: true, required: true, sparse: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    avatar: { type: String }, 
    friends: { type: [FriendsSchema] },
    friendRequestsSentTo: { type: [ReceiverFriendSchema] },
    friendRequestsReceivedFrom: { type: [SenderFriendSchema] },
    inbox: { type: [InboxSchema] },
    chatbotChats: { type: [ChatbotSchema]}
})


export const User = mongoose.model("User", UserSchema)