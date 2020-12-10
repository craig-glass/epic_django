from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser


class Profiles(AbstractUser):
    email = models.EmailField(max_length=254, unique=True, null=False)
    phone_number = models.CharField(max_length=20, null=True)
    term_address = models.CharField(max_length=150, null=True)

    REQUIRED_FIELDS = ['email']


class AccountSubmissions(models.Model):
    temp_id = models.AutoField(primary_key=True, null=False)

    firstname = models.CharField(max_length=150, null=False)
    email = models.EmailField(max_length=254, unique=True, null=False)
    date_submitted = models.DateTimeField(default=timezone.now, null=False)

    course = models.ForeignKey('courses.Courses', on_delete=models.SET_NULL, null=True)
