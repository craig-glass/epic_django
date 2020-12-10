from django.conf import settings
from django.core.validators import RegexValidator
from django.db import models
from django.utils import timezone


class Courses(models.Model):
    # e.g. course_id="c123", course_id="c800813569"
    course_id = models.CharField(max_length=10, primary_key=True, null=False,
                                 validators=[RegexValidator(r'^c[0-9]{1,9}$')])

    name = models.CharField(max_length=150, null=False)
    max_students = models.IntegerField(null=True)
    date_created = models.DateTimeField(default=timezone.now, null=False)

    about_page = models.OneToOneField('pages.MediaDisplayPage', on_delete=models.SET_NULL, null=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)


class StudentCourses(models.Model):
    join_id = models.AutoField(primary_key=True, null=False)
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=False)
    course = models.ForeignKey(Courses, on_delete=models.CASCADE, null=False)

    date_joined = models.DateTimeField(default=timezone.now, null=False)

    class Meta:
        unique_together = (('student', 'course'),)
