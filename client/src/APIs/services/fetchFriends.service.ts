interface Message {
    msg: string
    type: "sent" | "received"
}

type friend = {
    friendClerkId: string,
    friendUsername: string,
    friendAvatar: string
    messages: Message[],
}

export const fetchFriends = async (
    token: () => Promise<string | null>,
    userId: string | undefined
): Promise<friend[] | "Retry"> => {
    try {
        const authToken = await token();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${userId}/friends`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
            },
        });

        if (!res.ok) throw new Error("Failed to fetch friends");

        const data = await res.json();
        const friends: friend[] = data.userFriends;
        return friends;
    } catch (err) {
        console.error("error in fetching friends: ", err);
        return "Retry";
    }
};
