from django.conf import settings
from django.core.validators import RegexValidator
from django.db import models
from django.utils import timezone


class Modules(models.Model):
    # e.g. course_id="m123", course_id="m800813569"
    module_id = models.CharField(max_length=10, primary_key=True, null=False,
                                 validators=[RegexValidator(r'^m[0-9]{1,9}$')])
    course = models.ForeignKey('courses.Courses', on_delete=models.CASCADE, null=False)

    name = models.CharField(max_length=150, null=False)
    weight = models.IntegerField(null=True)
    date_created = models.DateTimeField(default=timezone.now, null=False)

    about_page = models.OneToOneField('pages.MediaDisplayPage', on_delete=models.SET_NULL, null=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    class Meta:
        unique_together = (('module_id', 'course'),)


class ModuleSubsections(models.Model):
    subsection_id = models.AutoField(primary_key=True, null=False)

    name = models.CharField(max_length=150, null=False)

    about_page = models.OneToOneField('pages.MediaDisplayPage', on_delete=models.SET_NULL, null=True)
    module = models.ForeignKey(Modules, on_delete=models.CASCADE, null=False)


class ModuleUsers(models.Model):
    join_id = models.AutoField(primary_key=True, null=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=False)
    module = models.ForeignKey(Modules, on_delete=models.CASCADE, null=False)

    relationship_type = models.CharField(max_length=40, null=False)

    class Meta:
        unique_together = (('user', 'module'),)


class SubsectionPages(models.Model):
    join_id = models.AutoField(primary_key=True, null=False)
    page = models.OneToOneField('pages.Pages', on_delete=models.CASCADE, null=False)
    subsection = models.ForeignKey(ModuleSubsections, on_delete=models.CASCADE, null=False)

    # null is false to prevent having two potential null values (NULL and '')
    block_id = models.CharField(max_length=150, null=False)

    class Meta:
        unique_together = (('page', 'subsection'),)
