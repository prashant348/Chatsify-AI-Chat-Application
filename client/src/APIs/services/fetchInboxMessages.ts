interface InboxMsgType {
    userId: string
    username: string
    userAvatar: string
    msg: string
    receivedAt: string
}

export const fetchInboxMessages = async (
    token: () => Promise<string | null>,
    userId: string | undefined,
): Promise<InboxMsgType[] | "Error"> => {
    try {
        const authToken = await token()
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${userId}/inbox`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        })
        if (!res.ok) throw new Error("Failed to fetch inbox messages")
        const data = await res.json()
        console.log(data)
        const inboxMessages = data.inbox // actual inbox messages array
        console.log("inbox fetched!")
        const reversedInboxMessages = [...inboxMessages].reverse() // reverse array for showing latest data first
        return reversedInboxMessages
    } catch (err) {
        console.error("error in fetching inbox messages: ", err)
        return "Error"
    }
}