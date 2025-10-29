// ACCEPT FRIEND REQUEST LOGIC
export const handleAcceptFriendRequest = async (
    token: () => Promise<string | null>,
    senderUsername: string | undefined,
    senderAvatar: string | undefined,
    senderId: string | undefined
): Promise<"Success" | "Error"> => {
    try {
        const authToken = await token()
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/accept-request`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({
                senderUsername: senderUsername,
                senderAvatar: senderAvatar,
                senderId: senderId
            })
        })
        if (!res.ok) throw new Error("Failed to accept friend request")
        const data = await res.json()
        console.log(data)
        return "Success"
    } catch (err) {
        console.error("err in accepting req: ", err)
        return "Error"
    }
}

// REJECT FRIEND REQUEST LOGIC
export const handleRejectFriendRequest = async (
    token: () => Promise<string | null>,
    senderId: string | undefined,
    receiverId: string | undefined,
): Promise<"Success" | "Error"> => {
    try {
        const authToken = await token()
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reject-request`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({
                senderId: senderId,
                receiverId: receiverId
            })
        })
        if (!res.ok) throw new Error("Failed to reject friend request")
        const data = await res.json()
        console.log(data)
        return "Success";
    } catch (err) {
        console.error("err in rejecting req: ", err)
        return "Error";
    }
}