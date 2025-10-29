from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from tts_service import  generate_tts_response, upload_audio_to_supabase
from llm_service import generate_llm_reponse

load_dotenv()

app = Flask(__name__)
CORS(app)

PORT = os.getenv("PORT")


@app.route("/api/generate_response", methods=["POST"])
def handle_llm(): 
    data = request.get_json()
    prompt = data.get("prompt")
    print("data from node server: ", prompt)

    if prompt:
        try:
            raw_response = generate_llm_reponse(prompt)
        except Exception as e:
            print("Error:", e)
            return jsonify({"error": str(e)}), 500

    return jsonify({"reply": raw_response}), 200


@app.route("/api/generate_audio", methods=["POST"])
def handle_tts():
    data = request.get_json()
    text = data.get("text")
    userClerkId = data.get("yourId")
    print("text: ", text, " userClerkId: ", userClerkId)
    audio_file = generate_tts_response(text=text, rate=160)
    audio_url = upload_audio_to_supabase(audio_file_name=audio_file, userClerkId=userClerkId)
    return jsonify({"audio_url": audio_url}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=True)