from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from tts_service import  generate_tts_response, upload_audio_to_supabase
from llm_service import generate_llm_response

load_dotenv()

app = Flask(__name__)
# Allow all origins for now (production mein specific origin set karein)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

PORT = os.getenv("PORT")
port = int(os.environ.get("PORT", 5001))

@app.route("/", methods=["GET"])
def home():
    return jsonify({ "message": "flask server running successfully!✅" }), 200

@app.route("/api/generate_response", methods=["POST"])
def handle_llm(): 
    try:
        data = request.get_json()
        if not data:
            print("❌ No JSON data received")
            return jsonify({"error": "No JSON data received"}), 400
        
        prompt = data.get("prompt")
        print(f"📥 Data from node server: {prompt}")

        if not prompt:
            print("❌ No prompt in request")
            return jsonify({"error": "Prompt is required"}), 400

        try:
            raw_response = generate_llm_response(prompt)
            print(f"✅ Generated response: {raw_response[:50]}...")
            return jsonify({"reply": str(raw_response)}), 200
        except Exception as e:
            print(f"❌ Error in generate_llm_response: {str(e)}")
            return jsonify({"error": str(e)}), 500

    except Exception as e:
        print(f"❌ Error in handle_llm: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/generate_audio", methods=["POST"])
def handle_tts():
    try:
        data = request.get_json()
        text = data.get("text")
        userClerkId = data.get("yourId")
        print(f"📥 text: {text}, userClerkId: {userClerkId}")
        
        if not text or not userClerkId:
            return jsonify({"error": "text and yourId are required"}), 400
            
        audio_file = generate_tts_response(text=text, rate=160)
        audio_url = upload_audio_to_supabase(audio_file_name=audio_file, userClerkId=userClerkId)
        return jsonify({"audio_url": audio_url}), 200
    except Exception as e:
        print(f"❌ Error in handle_tts: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port, debug=True)