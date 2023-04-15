import json
from urllib.parse import urlparse

import requests
from pytube import YouTube
import whisper
import pandas as pd
import ssl
ssl._create_default_https_context = ssl._create_unverified_context

from urllib.parse import urlencode


def download_audio_from_youtube(video_url, filename):
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
        # Create a YouTube object using the provided video URL
        yt = YouTube(video_url)
        # Filter the streams to get the first audio-only stream
        audio_stream = yt.streams.filter(only_audio=True).first()
        # Download the audio stream and save it with the specified filename
        output_path = audio_stream.download(filename=filename)
        return output_path
    except Exception as e:
        print(f"An error occurred: {e}")
        return None


def load_whisper_model(model_name="tiny"):
    """
    Load a Whisper model with the given model name.

    Parameters
        model_name :str : The name of the Whisper model to load.

    Returns
        model: The loaded Whisper model.
    """
    model = whisper.load_model(model_name)
    return model


def transcribe_audio(whisper_model, audio_file):
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

BERRY_CREATE_TEMPLATE_URL = "https://api.berri.ai/create_template"
BERRY_CREATE_APP_URL = "https://api.berri.ai/create_app"
BERRY_QUERY_APP_URL = "https://api.berri.ai/query"

def create_berry_app(file_name: str) -> str:
    """
    Creates berry template and app
    :param file_name: name of file in same directory
    :returns: berry app api endpoint
    """
    # Creating a template, update below config later
    app_config = {
        "advanced": {
            "intent": "qa_doc",
            "search": "default"
        }
    }

    create_template_data = {"app_config": json.dumps(app_config)}

    response = requests.post(BERRY_CREATE_TEMPLATE_URL, data=create_template_data)
    template_id = response.json()["template_id"]
    print("template_id: {}".format(template_id))

    # Now let's create an app
    create_app_data = {"template_id": template_id, "user_email": "test@berri.ai"}

    print("FILE_NAME: {}".format(file_name))
    files = {'data_source': open(file_name, 'rb')}

    response = requests.post(BERRY_CREATE_APP_URL, files=files, data=create_app_data)
    
    print(response.text)

    api_endpoint = response.json()["api_endpoint"]

    return api_endpoint


def does_url_app_exists(url: str) -> bool:
    """
    Method to check if we already have an app for a requested URL
    :param url: input url
    :returns: corresponding bool
    """
    mapping_file = open("./job/url_app_mapping.json", 'r')
    mapping = json.load(mapping_file)

    if url in mapping:
        return True

    return False


def update_url_endpoint_mapping(url: str, berry_endpoint: str) -> None:
    """
    Update url, berry endpoint mapping
    """
    mapping_file_read = open("./job/url_app_mapping.json", 'r')
    mapping = json.load(mapping_file_read)

    mapping_file_write = open("./job/url_app_mapping.json", 'w')
    mapping[url] = berry_endpoint
    mapping_file_write.write(json.dumps(mapping))



def query_berry(url: str, my_query: str) -> str:
    """
    Query berry endpoint corresponding to an input url
    """
    mapping_file = open("./job/url_app_mapping.json", 'r')
    mapping = json.load(mapping_file)

    berry_endpoint = mapping[url]

    querystring = {
        "user_email": "test@berri.ai",
        "instance_id": urlparse(berry_endpoint).query.split('=')[-1],
        "query": urlencode(my_query),
        "model": "gpt-3.5-turbo"
    }

    

    print('urlencode(my_query)=', urlencode(my_query))
    print('instance_id = ', urlparse(berry_endpoint).query.split('=')[-1])

    response = requests.get(url, params=querystring)

    # print('query_berry response = ', response)

    print(response.text)

    return response.text



