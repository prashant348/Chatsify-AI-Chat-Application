type Message = {
  msg: string
  type: "sent" | "received"
}

export const fetchChatMessages = async (
    yourId: string | undefined,
    friendId: string | undefined
): Promise<Message[] | "Error"> => {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${yourId}/${friendId}/chats`, {
            method: "GET",
            headers: {
                contentType: "application/json"
            }
        })
        if (!res.ok) throw new Error("failed to fetch chat messages")
        const data = await res.json()
        console.log(data)
        return data.chats;
    } catch (err) {
        console.log("err in fetching chat messages: ", err)
        return "Error";
    }
}