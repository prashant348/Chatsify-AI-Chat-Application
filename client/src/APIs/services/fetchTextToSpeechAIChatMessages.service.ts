type TextToSpeechAIMessage = {
    you: string;
    bot: string;
};

export const fetchTextToSpeechAIChatMessages = async (
    token: () => Promise<string | null>,
    yourId: string | undefined
): Promise<TextToSpeechAIMessage[] | "Error"> => {
    try {
        const authToken = await token()
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${yourId}/text-to-speech-ai-chats`, {
            method: "GET",
            headers: {
                contentType: "application/json",
                "authorization": `Bearer ${authToken}`
            }
        })
        if (!res.ok) throw new Error("failed to fetch chatbot chat messages")
        const data = await res.json()
        console.log(data)
        console.log(data.textToSpeechAIChats)
        const textToSpeechAIChatMessages: TextToSpeechAIMessage[] = data.textToSpeechAIChats
        console.log("text-to-speech-ai chats fetched!")
        return textToSpeechAIChatMessages
    } catch (err) {
        console.error("err in fetching  text-to-speech-ai chats: ", err)
        return "Error";
    }
}