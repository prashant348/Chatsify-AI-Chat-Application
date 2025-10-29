import os
import uuid
import pyttsx3
from supabase import create_client, Client
import dotenv

dotenv.load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


def generate_tts_response(
    text: str, 
    lang: str = "en", 
    rate: int = 120
): 
    global local_path_to_save_audio
    try: 
        audio_file_name = f"{uuid.uuid4()}.mp3"
        engine = pyttsx3.init()
        engine.setProperty("rate", rate)
        engine.setProperty("volume", 1.0)
        local_path_to_save_audio = f"../../temp/audios/{audio_file_name}"
        engine.save_to_file(text, local_path_to_save_audio)
        engine.runAndWait()
        return audio_file_name
    except Exception as e:
        print(e)
        return e
    



def upload_audio_to_supabase(audio_file_name: str, userClerkId: str):
    try: 
        supabase_path_to_upload_audio = f"{userClerkId}/{audio_file_name}"
        with open(local_path_to_save_audio, "rb") as f:
            res = supabase.storage.from_(SUPABASE_BUCKET).upload(
                path=supabase_path_to_upload_audio,
                file=f,
                file_options={
                    "content-type": "audio/mpeg"
                }
                )
        print(res)
        public_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(path=supabase_path_to_upload_audio)
        print(public_url)
        return public_url
    except Exception as e:
        print(e)
        return e
