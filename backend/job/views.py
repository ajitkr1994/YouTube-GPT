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

# Create your views here.

@api_view(['GET'])
def getAllJobs(request):
  filterSet = JobsFilter(request.GET, queryset=Job.objects.all().order_by('id'))

  count = filterSet.qs.count()
  # jobs = Job.objects.all()

  #Pagination
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

@api_view(['GET'])
def getJob(request, pk):
  job = get_object_or_404(Job, id=pk)

  serializer = JobSerializer(job, many=False)

  return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def newJob(request):
  data = request.data

  job = Job.objects.create(**data)

  serializer = JobSerializer(job, many=False)
  return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateJob(request, pk):
  job = get_object_or_404(Job, id=pk)

  if job.user != request.user:
    return Response({'message': 'You cannot update this job'}, status=status.HTTP_403_FORBIDDEN)

  job.title = request.data['title']
  job.email = request.data['email']
  job.description = request.data['description']
  job.address = request.data['address']
  job.jobType = request.data['jobType']
  job.education = request.data['education']
  job.industry = request.data['industry']
  job.experience = request.data['experience']
  job.salary = request.data['salary']
  job.positions = request.data['positions']
  job.company = request.data['company']

  job.save()

  serializer = JobSerializer(job, many=False)

  return Response(serializer.data)
  
@api_view(['DELETE'])
def deleteJob(request, pk):

  job = get_object_or_404(Job, id=pk)

  if job.user != request.user:
    return Response({'message': 'You cannot update this job'}, status=status.HTTP_403_FORBIDDEN)

  job.delete()

  return Response({'message': 'Job is deleted.'}, status=status. HTTP_200_OK)



@api_view(['GET'])
def getTopicStats(request, topic):
  args = {'title__icontains': topic}

  jobs = Job.objects.filter(**args)

  if len(jobs) == 0:
    return Response({'message': 'No stats found for {topic}'.format(topic=topic)})

  stats = jobs.aggregate(
    total_jobs = Count('title'),
    avg_positions = Avg('positions'),
    avg_salary = Avg('salary'),
    min_salary = Min('salary'),
    max_salary = Max('salary')
  )

  return Response(stats)

