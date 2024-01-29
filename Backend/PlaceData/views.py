# views.py
from rest_framework.response import Response
from .models import Place_Data
from .serializers import PlaceDataSerializer
from rest_framework.decorators import api_view


@api_view(['GET'])
def get_all_destinations(request):
    print("Request received")  # Add print statements for debugging
    destinations = Place_Data.objects.all()
    serializer = PlaceDataSerializer(destinations, many=True)
    return Response({'destinations': serializer.data})