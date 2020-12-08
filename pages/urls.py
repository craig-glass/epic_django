from django.conf.urls import url
from django.urls import path
from .views import AboutPageView

urlpatterns = [
    path('about/', AboutPageView.as_view(), name='about'),
]