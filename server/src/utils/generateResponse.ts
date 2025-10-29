interface FlaskData {
    reply: string
}

export const generateResponse = async (
    prompt: string
): Promise<string> => {
    try {
        const flaskRes = await fetch(`${process.env.FLASK_API_URL}/api/generate_response`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: prompt }), // JSON format mai bhejna zaruri hai
        })
        if (!flaskRes.ok) throw new Error("Failed to generate response")
        const flaskData: FlaskData = await flaskRes.json()
        console.log(flaskData.reply)
        return flaskData.reply
    } catch (err) {
        console.error("err in generating response: ", err)
        return "Error generating response"
    }
}
