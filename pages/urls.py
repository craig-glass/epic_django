from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<int:page_id>/', views.page, name='page_display'),
]
