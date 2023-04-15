from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Job
from .serializers import JobSerializer
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.db.models import Avg, Min, Max, Count
from .filters import JobsFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from .utils import *

# Create your views here.
model = load_whisper_model()
file_path_transcript = "./job/transcript_blob.txt"

@api_view(['GET'])
def getAllJobs(request):
    filterSet = JobsFilter(request.GET, queryset=Job.objects.all().order_by('id'))

    count = filterSet.qs.count()
    # jobs = Job.objects.all()

    # Pagination
    resPerPage = 3
    paginator = PageNumberPagination()
    paginator.page_size = resPerPage

    queryset = paginator.paginate_queryset(filterSet.qs, request)

    serializer = JobSerializer(queryset, many=True)

    return Response({
        "resPerPage": resPerPage,
        "count": count,
        "jobs": serializer.data
    })


@csrf_exempt
@api_view(['POST'])
def getTranscript(request):
    data = request.data
    url = data['url']
    print('backend received url = ', url)

    if does_url_app_exists(url):
        return Response({'message': 'random'}, status=status.HTTP_200_OK)

    output_string = transcribe_audio(model, download_audio_from_youtube(url, "audio.mp4"))
    #output_string = "my random string"
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



