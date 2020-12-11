from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='page_index'),
    path('<int:page_id>/', views.page),
    path('add/', views.add_page, name='page_add')
]
