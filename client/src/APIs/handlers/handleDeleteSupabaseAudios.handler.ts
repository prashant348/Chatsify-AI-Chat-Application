export const handleDeleteSupabaseAudios = async (
    userId: string | undefined
): Promise<"Success" | "Error"> => {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/delete-supabase-audios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId
            })
        })
        if (!res.ok) throw new Error("Failed to delete supabase audios")
        const data = await res.json()
        console.log(data)
        console.log("supabase audios deleted!")
        return "Success"
    } catch (err) {
        console.error("error in handleDeleteSupabaseAudios: ", err)
        return "Error"
    }
}