

export const handleRemoveInboxMessage = async (
    token: () => Promise<string | null>,
    userId: string | undefined,
    receiverId: string | undefined,
    receivedAt: string | undefined,
): Promise<"Success" | "Error"> => {
    try {
        const authToken = await token()
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${userId}/inbox`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({
                userId: receiverId,
                receivedAt: receivedAt
            })
        })
        if (!res.ok) throw new Error("Failed to fetch inbox messages")
        const data = await res.json()
        console.log(data)
        console.log("inbox msg deleted!")
        return "Success"
    } catch (err) {
        console.error("error in removing msg: ", err)
        return "Error"
    } 
}