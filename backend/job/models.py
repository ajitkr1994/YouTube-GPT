from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import *
from django.contrib.auth.models import User

# Create your models here.

class JobType(models.TextChoices):
  Permanent = 'Permanent'
  Temporary = 'Temporary'
  Iinternship = 'Internship'


class Education(models.TextChoices):
  Bachelors = 'Bachelors'
  Masters = 'Masters'
  Phd = 'Phd'

class Industry(models.TextChoices):
  Business = 'Business'
  IT = 'IT'

class Experience(models.TextChoices):
  NO_EXPERIENCE = 'No experience'
  ONE_YEAR = '1 Years'

def return_date_time():
  now = datetime.now()
  return now + timedelta(days=10)

class Job(models.Model):
  title = models.CharField(max_length= 200, null=True)
  description = models.TextField(null=True)
  email = models.EmailField(null=True)
  address = models.CharField(max_length = 100, null = True)
  jobType = models.CharField(max_length = 10, choices=JobType.choices,default = JobType.Permanent)
  education = models.CharField(max_length = 20, choices=Education.choices,default = Education.Bachelors)
  industry = models.CharField(max_length = 20, choices=Industry.choices,default = Industry.Business)
  experience = models.CharField(max_length = 20, choices = Experience.choices, default=Experience.NO_EXPERIENCE)
  salary = models.IntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(1000000)])
  positions = models.IntegerField(default=1)
  company = models.CharField(max_length=100, null=True)
  lastDate = models.DateTimeField(default=return_date_time)
  user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
  createdAt = models.DateTimeField(auto_now_add=True)

  def save(self, *args, **kwargs):
    super(Job, self).save(*args, **kwargs)