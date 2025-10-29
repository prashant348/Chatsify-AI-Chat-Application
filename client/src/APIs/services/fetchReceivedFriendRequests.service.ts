interface FriendRequetsType {
    senderId: string,
    senderUsername: string,
    senderAvatar: string,
    receivedAt: string
}

export const fetchReceivedFriendRequests = async (
    token: () => Promise<string | null>,
): Promise<FriendRequetsType[] | "Error"> => {
    try {
        const authToken = await token();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/receive-request`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            }
        })
        if (!res.ok) throw new Error("Failed to fetch received friend requests")
        const data = await res.json()
        const friendRequests: FriendRequetsType[] = data.friendRequestsReceivedFrom_List
        console.log("frnd reqs arr: ", friendRequests)
        console.log("length: ", friendRequests.length)
        return friendRequests
    } catch (err) {
        console.error("error in fetching requests: ", err)
        return "Error"
    }
}

