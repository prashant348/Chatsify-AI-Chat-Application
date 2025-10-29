export const handleDeleteTextToSpeechAIChat = async (
    yourId: string | undefined
): Promise<"Success" | "Error"> => {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${yourId}/delete-text-to-speech-ai-chats`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                yourId: yourId
            })
        })

        const data = await res.json()
        console.log(data)
        console.log("you and your text-to-speech-ai chats deleted!")
        return "Success";
    } catch (err) {
        console.error("err in deleting text-to-speech-ai chats: ", err)
        return "Error";
    }
} 