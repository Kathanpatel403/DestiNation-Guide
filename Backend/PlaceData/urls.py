# urls.py
from django.urls import path
from .views import get_all_destinations

urlpatterns = [
    path('api/destinations/', get_all_destinations, name='get_all_destinations')
]