from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.db import models
from django.utils import timezone

page_storage = FileSystemStorage(location='/files/pages')
media_storage = FileSystemStorage(location='/files/media')
answer_storage = FileSystemStorage(location='/files/answers')


class Pages(models.Model):
    page_id = models.AutoField(primary_key=True, null=False)

    file = models.FileField(storage=page_storage, null=False)
    date_stored = models.DateTimeField(default=timezone.now, null=False)

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=False)


class Media(models.Model):
    media_id = models.AutoField(primary_key=True, null=False)

    file = models.FileField(storage=media_storage, null=False)


class MediaDisplayPage(models.Model):
    page = models.OneToOneField(Pages, on_delete=models.CASCADE, primary_key=True, null=False)


class PageMedia(models.Model):
    join_id = models.AutoField(primary_key=True, null=False)
    page = models.ForeignKey(Pages, on_delete=models.CASCADE, null=False)
    media_page = models.ForeignKey(MediaDisplayPage, on_delete=models.CASCADE, null=False)

    class Meta:
        unique_together = (('page', 'media_page'),)


class SubmissionDisplayPage(models.Model):
    page = models.OneToOneField(Pages, on_delete=models.CASCADE, primary_key=True, null=False)

    max_mark = models.IntegerField(null=True)
    expected_duration = models.TimeField(null=True)


class UserAnswers(models.Model):
    join_id = models.AutoField(primary_key=True, null=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=False)
    submission_page = models.ForeignKey('pages.SubmissionDisplayPage', on_delete=models.CASCADE, null=False)

    mark = models.IntegerField(null=True)
    file = models.FileField(storage=answer_storage, null=False)
    date_submitted = models.DateTimeField(default=timezone.now, null=False)

    class Meta:
        unique_together = (('user', 'submission_page'),)


class QuizSubmissionPage(models.Model):
    submission_page = models.OneToOneField(SubmissionDisplayPage, on_delete=models.CASCADE,
                                           primary_key=True, null=False)


class FileSubmissionPage(models.Model):
    submission_page = models.OneToOneField(SubmissionDisplayPage, on_delete=models.CASCADE,
                                           primary_key=True, null=False)
