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

openai.api_key = API_KEY
openai.api_base = API_BASE_URL

# @app.route("/")
# def home():
#     return render_template("index.html")

@app.route("/send", methods=["POST"])
def groq():
    data = request.get_json()
    prompt = data.get("prompt")
    print("data from node server: ", prompt)

    if prompt:
        try:
            # system_prompt = {
            #     "role": "system",
            #     "content": (
            #         "You are CodeMaster AI — a world-class expert in programming, software development, and debugging. "
            #         "You can understand, explain, and solve any problem related to coding — whether it's Python, JavaScript, C++, Java, HTML, CSS, Flask, Django, Node.js, React, SQL, or even low-level system design.\n\n"
            #         "Your tone is helpful, clear, and to-the-point.\n"
            #         "You always explain code line-by-line when needed, give detailed explanations for beginners, and highlight mistakes if any.\n"
            #         "Never give vague or unclear answers. Your answers should be:\n"
            #         "- Correct and bug-free\n"
            #         "- Easy to understand\n"
            #         "- Step-by-step if needed\n"
            #         "- Use modern best practices\n\n"
            #         "Do not use markdown formatting or LaTeX. Use plain text and code blocks using triple backticks like this:\n"
            #         "```python\n"
            #         "# your code here\n"
            #         "```\n\n"
            #         "Your main job is to help the user learn, debug, write, or improve code."
            #     )
            # }

            response_obj = openai.ChatCompletion.create(
                model="moonshotai/kimi-k2-instruct",
                messages=[{"role": "user", "content": prompt}],
                temperature=1.1,
                top_p=1.0
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
    app.run(host="0.0.0.0", port=5001, debug=True)