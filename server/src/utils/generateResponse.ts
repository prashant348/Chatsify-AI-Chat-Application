interface FlaskData {
    reply: string
}

export const generateResponse = async (
    prompt: string
): Promise<string> => {
    try {
        const flaskUrl = process.env.FLASK_API_URL;
        
        // Debug: Check if URL is set
        if (!flaskUrl) {
            console.error("❌ FLASK_API_URL environment variable is not set!");
            return "Error generating response: Flask server URL not configured";
        }

        console.log(`🔗 Calling Flask API: ${flaskUrl}/api/generate_response`);
        console.log(`📝 Prompt: ${prompt.substring(0, 50)}...`);

        // Add timeout and better error handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        const flaskRes = await fetch(`${flaskUrl}/api/generate_response`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Connection": "keep-alive"
            },
            body: JSON.stringify({ prompt: prompt }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log(`📊 Flask Response Status: ${flaskRes.status} ${flaskRes.statusText}`);

        if (!flaskRes.ok) {
            const errorText = await flaskRes.text();
            console.error(`❌ Flask Error Response: ${errorText}`);
            throw new Error(`Flask server returned ${flaskRes.status}: ${errorText}`);
        }

        const flaskData: FlaskData = await flaskRes.json();
        console.log(`✅ Flask Response received: ${flaskData.reply.substring(0, 50)}...`);
        return flaskData.reply;
    } catch (err: any) {
        if (err.name === 'AbortError') {
            console.error("⏱️ Request timeout: Flask server took too long to respond");
            return "Error generating response: Request timeout";
        }
        if (err.message?.includes('fetch failed') || err.message?.includes('ECONNREFUSED')) {
            console.error("🔌 Connection failed: Flask server might be down or unreachable");
            console.error("Full error:", err.message);
            return "Error generating response: Cannot reach Flask server";
        }
        console.error("❌ Error in generating response:", err);
        return "Error generating response";
    }
}
