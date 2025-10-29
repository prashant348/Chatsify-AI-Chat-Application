type User = {
    id: string
    username: string
    imageUrl: string
}

export const fetchUsersGlobaly = async (
    query: string,
    abortSignal: AbortSignal,
    setFilteredUsers: (users: User[]) => void,
    setIsLoading: (show: boolean) => void
): Promise<string> => {
    if (!query) {
        setFilteredUsers([])
        setIsLoading(false)
        return "Search people by their usernames!"
    }
    setIsLoading(true)
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
            signal: abortSignal
        });
        if (!res.ok) throw new Error("Failed to fetch users")
        const data = await res.json()
        const matched: User[] = data.filter((user: User) => {
            return user.username.startsWith(query)
        })
        setFilteredUsers(matched)
        setIsLoading(false)
        if (matched.length > 0) {
            console.log("Found:", matched);
            console.log("Found for: ", query)
        }
        else if (matched.length === 0 && !query) {
            console.log("Search people by their usernames!")
            return "Search people by their usernames!"
        }
        else if (matched.length === 0 && query) {
            console.log("No users found for: ", query)
            return "No users found!"
        }
        return "Success";
    } catch (err: any) {
        if (err.name === "AbortError") {
            console.log("Previous request was cancelled!")
            return "AbortError"
        }
        console.error("error in fetching users: ", err)
        return "Error"
    }
}