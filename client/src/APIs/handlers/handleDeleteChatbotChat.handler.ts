export const handleDeleteChatbotChat = async (
    yourId: string | undefined
): Promise<"Success" | "Error"> => {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${yourId}/delete-chatbot-chats`, {
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
        console.log("you and your chatbot chats deleted!")
        return "Success";
    } catch (err) {
        console.error("err in deleting chatbot chats: ", err)
        return "Error";
    }
}