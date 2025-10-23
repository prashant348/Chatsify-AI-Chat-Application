from flask import Flask, render_template, request, jsonify
import openai
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("API_KEY")
API_BASE_URL = os.getenv("API_BASE_URL")
PORT = os.getenv("PORT")

openai.api_key = API_KEY
openai.api_base = API_BASE_URL

@app.route("/generate_response", methods=["POST"])
def groq(): 
    data = request.get_json()
    prompt = data.get("prompt")
    print("data from node server: ", prompt)

    if prompt:
        try:
            # system_prompt = {
            #     "role": "system",
            #     "content": (
            #     )
            # }

            response_obj = openai.ChatCompletion.create(
                model="moonshotai/kimi-k2-instruct",
                messages=[{"role": "user", "content": prompt}],
                temperature=1.1,
                top_p=0.8
            )

            raw_response = response_obj.choices[0].message["content"].strip()

            print(raw_response)

            with open("./response.txt", "a", encoding="utf-8") as f:
                f.write(f"You: {prompt}\nBot: {raw_response}\n" + "\n")


        except Exception as e:
            print("Error:", e)
            return jsonify({"error": str(e)}), 500


    return jsonify({"reply": raw_response}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=True)