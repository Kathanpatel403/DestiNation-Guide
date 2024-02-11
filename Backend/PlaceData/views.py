# views.py
from rest_framework.response import Response
from .models import Place_Data
from .serializers import PlaceDataSerializer
from rest_framework.decorators import api_view
from django.http import JsonResponse


@api_view(['GET'])
def get_all_destinations(request):
    print("Request received")  # Add print statements for debugging
    destinations = Place_Data.objects.all()
    serializer = PlaceDataSerializer(destinations, many=True)
    return Response({'destinations': serializer.data})

def add_place(request):
    if request.method == 'GET':
        # Here you would handle the POST request data and save it to the database
        # Example:
        place_name = request.POST.get('name')
        # Save other place details to the database
        
        # Dummy response for now
        return JsonResponse({'message': 'Place added successfully'}, status=201)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)