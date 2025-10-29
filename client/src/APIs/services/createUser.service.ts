
export const createUser = async (
    yourClerkId: string | undefined,
    yourUsername: string | null | undefined,
    yourEmail: string | undefined,
    yourAvatar: string | undefined,
    signal: AbortSignal
): Promise<"Success" | "Error"> => {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${yourClerkId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clerkUserId: yourClerkId,
                username: yourUsername,
                email: yourEmail,
                avatar: yourAvatar
            }),
            signal
        })
        if (!res.ok) throw new Error("Failed to create user(you)")
        const data = await res.json()
        console.log(data)
        return "Success";
    } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
            console.log("request aborted")
            return "Error";
        }
        console.error("error in creating user(you): ", err)
        return "Error";
    }
}