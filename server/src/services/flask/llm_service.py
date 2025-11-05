import openai
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("API_KEY")
API_BASE_URL = os.getenv("API_BASE_URL")
PORT = os.getenv("PORT")

openai.api_key = API_KEY
openai.api_base = API_BASE_URL


def generate_llm_response(prompt: str) -> str:
    try: 
        response_obj = openai.ChatCompletion.create(
            model="moonshotai/kimi-k2-instruct",
            messages=[{"role": "user", "content": prompt}],
            temperature=1.1,
            top_p=0.8
        )

        raw_response = response_obj.choices[0].message["content"].strip()

        print("RAW_RESPONSE: ", raw_response, "TYPE: ", type(raw_response))

        with open("./response.txt", "a", encoding="utf-8") as f:
            f.write(f"You: {prompt}\nBot: {raw_response}\n" + "\n")

        return str(raw_response)
    except Exception as e:
        print(e)
        return str(e)