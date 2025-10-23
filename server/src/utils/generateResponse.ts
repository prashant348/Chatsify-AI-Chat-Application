interface FlaskData {
    reply: string
}

export const generateResponse: (param: string) => Promise<string> = async (prompt) => {
    try {
        const flaskRes = await fetch(`${process.env.FLASK_API_URL}/generate_response`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: prompt }), // JSON format mai bhejna zaruri hai
        })

        const flaskData: FlaskData = await flaskRes.json()
        console.log(flaskData.reply)
        return flaskData.reply
    } catch (err) {
        console.error("err in generating response: ", err)
        return "Error generating response"
    }
}
