from pytube import YouTube
import whisper
import pandas as pd
import ssl
ssl._create_default_https_context = ssl._create_unverified_context


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
