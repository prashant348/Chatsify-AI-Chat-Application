export const handleDeleteUserChat = async (
    token: () => Promise<string | null>,
    yourId: string | undefined,
    friendId: string | undefined
): Promise<"Success" | "Error"> => {
    try {
        const authToken = await token()
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${yourId}/${friendId}/delete-chats`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({
                yourId: yourId,
                friendId: friendId
            })
        })
        if (!res.ok) throw new Error("failed to delete chat")
        const data = await res.json()
        console.log(data)
        console.log("you and your friend's chat deleted!")
        return "Success";
    } catch (err) {
        console.error("err in deleting chats: ", err)
        return "Error";
    }
}