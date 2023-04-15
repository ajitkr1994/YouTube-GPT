from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt

from .models import Job
from .serializers import JobSerializer
from .filters import JobsFilter
from .utils import *

# Load the Whisper model
model = load_whisper_model()
file_path_transcript = "./job/transcript_blob.txt"

@api_view(['GET'])
def getAllJobs(request):
    filter_set = JobsFilter(request.GET, queryset=Job.objects.all().order_by('id'))
    count = filter_set.qs.count()

    # Pagination
    res_per_page = 3
    paginator = PageNumberPagination()
    paginator.page_size = res_per_page
    queryset = paginator.paginate_queryset(filter_set.qs, request)

    serializer = JobSerializer(queryset, many=True)
    return Response({
        "resPerPage": res_per_page,
        "count": count,
        "jobs": serializer.data
    })

@csrf_exempt
@api_view(['POST'])
def getTranscript(request):
    data = request.data
    url = data['url']

    if does_url_app_exists(url):
        return Response({'message': 'random'}, status=status.HTTP_200_OK)

    output_string = transcribe_audio(model, download_audio_from_youtube(url, "audio.mp4"))
    with open(file_path_transcript, 'w') as file:
        file.write(output_string)
    
    berry_endpoint = create_berry_app(file_name=file_path_transcript)
    update_url_endpoint_mapping(url, berry_endpoint)

    return Response({'message': 'random'}, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['POST'])
def queryEndpoint(request):
    data = request.data
    url = data['url']
    query = data['my_query']

    response = query_berry(url, query)
    return Response({'message': response}, status=status.HTTP_200_OK)
