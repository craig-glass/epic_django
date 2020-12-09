from django.db import models
from django.contrib.auth.models import AbstractUser


class Account(AbstractUser):
    email = models.EmailField(max_length=254, unique=True, null=False)
    phone_number = models.CharField(max_length=20, null=True)
    term_address = models.CharField(max_length=150, null=True)

    REQUIRED_FIELDS = ['email']
