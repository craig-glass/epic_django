from django.urls import path
from .views import aboutPageView

urlpatterns = [
    path('about/', aboutPageView, name='about'),
]