import { apiGet } from "../../libs/api"
interface InboxMsgType {
    userId: string
    username: string
    userAvatar: string
    msg: string
    receivedAt: string
}

// export const fetchInboxMessages = async (
//     token: () => Promise<string | null>,
//     userId: string | undefined,
// ): Promise<InboxMsgType[] | "Error"> => {
//     try {
//         const authToken = await token()
//         const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${userId}/inbox`, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${authToken}`
//             }
//         })
//         if (!res.ok) throw new Error("Failed to fetch inbox messages")
//         const data = await res.json()
//         console.log(data)
//         const inboxMessages = data.inbox // actual inbox messages array
//         console.log("inbox fetched!")
//         const reversedInboxMessages = [...inboxMessages].reverse() // reverse array for showing latest data first
//         return reversedInboxMessages
//     } catch (err) {
//         console.error("error in fetching inbox messages: ", err)
//         return "Error"
//     }
// }
export async function fetchInboxMessages(
    getToken: any,
    userId: string | undefined
): Promise<InboxMsgType[] | "Error"> {
    try {
        // ✅ Fix: Check if userId exists
        if (!userId) {
            console.warn("No userId provided for fetchInboxMessages");
            return [];
        }

        const token = await getToken?.();
        
        // ✅ Fix: Check if token exists (was checking token instead of !token)
        if (!token) {
            console.warn("No token available for fetchInboxMessages");
            return [];
        }

        const data = await apiGet<{ inbox: InboxMsgType[] }>(`/api/${userId}/inbox`, token)
        
        // ✅ Fix: Handle null/undefined inbox and return empty array
        if (!data || !data.inbox || !Array.isArray(data.inbox)) {
            return [];
        }

        // Reverse array for showing latest data first
        const reversedInboxMessages = [...data.inbox].reverse();
        return reversedInboxMessages;
    } catch (e: any) {
        console.error("error in fetching inbox messages: ", e);
        return "Error";
    } 
}
