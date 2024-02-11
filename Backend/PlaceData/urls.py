# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('api/destinations/', views.get_all_destinations, name='get_all_destinations'),
    path('api/places/add/', views.add_place, name='add_place'),
]