import json
from typing import Optional
from urllib.parse import urlparse, quote

import requests
from pytube import YouTube
import whisper
import ssl
ssl._create_default_https_context = ssl._create_unverified_context

BERRY_CREATE_TEMPLATE_URL = "https://api.berri.ai/create_template"
BERRY_CREATE_APP_URL = "https://api.berri.ai/create_app"
BERRY_QUERY_APP_URL = "https://api.berri.ai/query"
MAPPING_FILE_PATH = "./job/url_app_mapping.json"
USER_EMAIL = "test@berri.ai"

def download_audio_from_youtube(video_url: str, filename: str) -> Optional[str]:
    """
    Parameters
        video_url : str : The URL of the YouTube video from which to download the audio.
        filename : str : The name of the output file (excluding the file extension).
    
    Returns
    str: The file path of the downloaded audio file.

    Example
    >>> download_audio_from_youtube("https://www.youtube.com/watch?v=oHWuv1Aqrzk", "audio.mp4")
    """
    try:
        yt = YouTube(video_url)
        audio_stream = yt.streams.filter(only_audio=True).first()
        output_path = audio_stream.download(filename=filename)
        return output_path
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def load_whisper_model(model_name: str = "tiny"):
    """
    Load a Whisper model with the given model name.

    Parameters
        model_name :str : The name of the Whisper model to load.

    Returns
        model: The loaded Whisper model.
    """
    model = whisper.load_model(model_name)
    return model

def transcribe_audio(whisper_model, audio_file: str) -> str:
    """
    Transcribe an audio file using the given Whisper model.

    Parameters
        whisper_model: The loaded Whisper model.
        audio_file (str): The path to the audio file to transcribe.

    Returns
        str: The transcribed text.
    """
    transcription = whisper_model.transcribe(audio_file)
    return transcription['text']

def create_berry_app(file_name: str) -> str:
    app_config = {
        "advanced": {
            "intent": "qa_doc",
            "search": "default"
        }
    }
    create_template_data = {"app_config": json.dumps(app_config)}
    response = requests.post(BERRY_CREATE_TEMPLATE_URL, data=create_template_data)
    template_id = response.json()["template_id"]

    create_app_data = {"template_id": template_id, "user_email": USER_EMAIL}
    with open(file_name, 'rb') as data_source:
        files = {'data_source': data_source}
        response = requests.post(BERRY_CREATE_APP_URL, files=files, data=create_app_data)

    api_endpoint = response.json()["api_endpoint"]
    return api_endpoint

def does_url_app_exists(url: str) -> bool:
    try:
        with open(MAPPING_FILE_PATH, 'r') as mapping_file:
            mapping = json.load(mapping_file)
        return url in mapping
    except FileNotFoundError:
        return False

def update_url_endpoint_mapping(url: str, berry_endpoint: str) -> None:
    try:
        with open(MAPPING_FILE_PATH, 'r') as mapping_file:
            mapping = json.load(mapping_file)
    except FileNotFoundError:
        mapping = {}

    mapping[url] = berry_endpoint

    with open(MAPPING_FILE_PATH, 'w') as mapping_file:
        json.dump(mapping, mapping_file)

def query_berry(url: str, my_query: str) -> str:
    try:
        with open(MAPPING_FILE_PATH, 'r') as mapping_file:
            mapping = json.load(mapping_file)
    except FileNotFoundError:
        print("Mapping file not found.")
        return ""

    berry_endpoint = mapping.get(url)
    if not berry_endpoint:
        print("Berry endpoint not found for the given URL.")
        return ""

    instance_id = urlparse(berry_endpoint).query.split('=')[-1]

    response = requests.get(f'https://api.berri.ai/query?user_email={USER_EMAIL}&instance_id={instance_id}&query={quote(my_query)}')
    return response.json()['response']
