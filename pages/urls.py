from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='page_index'),
    path('page/<str:page_id>/', views.page),
    path('add/', views.add_page, name='page_add'),
    path('edit/<str:page_id>/', views.edit_page, name='page_edit'),
    path('ajax/save_page/', views.save_ajax, name='save_page'),
    path('ajax/get_page_count/', views.get_page_count_ajax, name='get_page_count'),
    path('ajax/get_pages/', views.get_pages_ajax, name='get_pages'),
    path('ajax/get_page_data/', views.get_page_data_ajax, name='get_page_data'),
]
