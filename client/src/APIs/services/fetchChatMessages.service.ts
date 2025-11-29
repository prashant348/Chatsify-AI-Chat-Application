import { apiGet } from "../../libs/api"

type ChatMessage = {
    msg: string
    type: "sent" | "received"
}

// export const fetchChatMessages = async (
//     yourId: string | undefined,
//     friendId: string | undefined,
//     abortSignal: AbortSignal
// ): Promise<Message[] | "Error" | "AbortError"> => {
//     try {
//         const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${yourId}/${friendId}/chats`, {
//             method: "GET",
//             headers: {
//                 contentType: "application/json"
//             },
//             signal: abortSignal
//         })
//         if (!res.ok) throw new Error("failed to fetch chat messages")
//         const data = await res.json()
//         console.log(data)
//         return data.chats;
//     } catch (err: any) {
//         if (err.name === "AbortError") {
//             console.log("Previous request was cancelled!")
//             return "AbortError";
//         }
//         console.log("err in fetching chat messages: ", err)
//         return "Error";
//     }
// }

export async function fetchChatMessages(
    yourId: string,
    friendId: string,
) {
    try {
        if (!yourId || !friendId) return [];
        const data = await apiGet<{ chats: ChatMessage[] }>(`/api/${yourId}/${friendId}/chats`)
        return data.chats
    } catch (e: any) {
        return "Retry";
    }
}