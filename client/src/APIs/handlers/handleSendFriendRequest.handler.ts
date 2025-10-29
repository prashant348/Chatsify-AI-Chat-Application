import type { UserResource } from "@clerk/types";

export const handleSendFriendRequest = async (
    user: UserResource | null | undefined, 
    receiverId: string, 
    receiverUsername: string
): Promise<string> => {

    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/send-request`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                senderUsername: user?.username,
                senderId: user?.id,
                senderEmail: user?.emailAddresses[0].emailAddress,
                senderAvatar: user?.imageUrl,
                receiverId: receiverId,
                receiverUsername: receiverUsername
            })
        });

        const data = await res.json()
        console.log(data)
        // setResMsg(data.message)
        return data.message
    } catch (err) {
        console.error("error in sending req: ", err)
        return "Error"
    }
}