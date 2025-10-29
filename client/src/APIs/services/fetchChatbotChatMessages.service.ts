type ChatbotMessage = {
    you: string;
    bot: string;
};

export const fetchChatbotChatMessages = async (
    token: () => Promise<string | null>,
    yourId: string | undefined
): Promise<ChatbotMessage[] | "Error"> => {
    try {
        const authToken = await token()
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${yourId}/chatbot-chats`, {
            method: "GET",
            headers: {
                contentType: "application/json",
                "authorization": `Bearer ${authToken}`
            }
        })
        if (!res.ok) throw new Error("failed to fetch chatbot chat messages")
        const data = await res.json()
        console.log(data)
        console.log(data.chatbotChats)
        const chatbotChatsMessages: ChatbotMessage[] = data.chatbotChats
        console.log("chatbot chats fetched!")
        return chatbotChatsMessages
    } catch (err) {
        console.error("err in fetching chatbot chats: ", err)
        return "Error";
    }
}