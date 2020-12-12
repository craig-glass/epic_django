from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='page_index'),
    path('page/<int:page_id>/', views.page),
    path('add/', views.add_page, name='page_add'),
    path('ajax/save_page/', views.save_ajax, name='save_page'),
]
