interface FlaskData {
    audio_url: string
}
export const generateAudio = async (
    text: string,
    yourId: string
): Promise<string | "Error"> => {
    try {
        const flaskRes = await fetch(`${process.env.FLASK_API_URL}/api/generate_audio`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: text, yourId: yourId }), // JSON format mai bhejna zaruri hai
        })
        if (!flaskRes.ok) throw new Error("Failed to generate audio")
        const flaskData: FlaskData = await flaskRes.json()
        console.log("flaskData from generateAudio: ", flaskData)
        const audioUrl = flaskData.audio_url
        return audioUrl
    } catch (err) {
        console.error("err in generating audio: ", err)
        return "Error"
    } 
}