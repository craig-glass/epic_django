from django.contrib import admin
from .models import Pages, Media, MediaDisplayPage, PageMedia,\
    SubmissionDisplayPage, UserAnswers, QuizSubmissionPage, FileSubmissionPage

admin.site.register(Pages)
admin.site.register(Media)
admin.site.register(MediaDisplayPage)
admin.site.register(PageMedia)
admin.site.register(SubmissionDisplayPage)
admin.site.register(UserAnswers)
admin.site.register(QuizSubmissionPage)
admin.site.register(FileSubmissionPage)
