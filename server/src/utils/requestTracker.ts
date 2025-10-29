export const requestTracker = async (
    userId: string
): Promise<number | "Error"> => {
    try {
        const res = await fetch(`${process.env.NODE_API_URL}/api/${userId}/request-made`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (!res.ok) throw new Error("Failed to fetch requests made")
        const data = await res.json()
        console.log(data.requestsMade) 
        return data.requestsMade
    } catch (err) {
        console.error("error in request tracker: ", err)
        return "Error"
    }
}