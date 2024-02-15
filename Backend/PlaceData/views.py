# views.py
from rest_framework.response import Response
from .models import Place_Data
from .serializers import PlaceDataSerializer
from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.db import models


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


@api_view(['POST'])
def get_bookmarked_places(request):
    try:
        data = json.loads(request.body)
        bookmarked_places_ids = data.get('BookmarkedPlaces', [])

        # Convert Place_id values to integers for querying
        bookmarked_places_ids = [int(place_id) for place_id in bookmarked_places_ids]

        # Query places with matching Place_id
        bookmarked_places = Place_Data.objects.filter(Place_id__in=bookmarked_places_ids)
        serializer = PlaceDataSerializer(bookmarked_places, many=True)

        return Response({'bookmarked_places': serializer.data})
    except Exception as e:
        return JsonResponse({'error': str(e)})
    
@api_view(['POST'])
def get_searched_places(request):
    try:
        data = json.loads(request.body)
        user_input = data.get('user_input', '')
        print(data)

        matching_places = Place_Data.objects.filter(
            models.Q(Name__icontains=user_input) |
            models.Q(Category__icontains=user_input) |
            models.Q(City__icontains=user_input) |
            models.Q(State__icontains=user_input) |
            models.Q(LongDescription__icontains=user_input) |
            models.Q(ShortDescription__icontains=user_input) |
            models.Q(Activities__icontains=user_input) |
            models.Q(Amenities__icontains=user_input)
        )

        print(matching_places)
        for place in matching_places:
            print("Place Data - Name:", place.Name)
        if matching_places.exists():
            serializer = PlaceDataSerializer(matching_places, many=True)
            serialized_data = serializer.data
            return Response({'matching_places': serialized_data})
        else:
            return JsonResponse({'message': 'No matching places found'}, status=404, safe=False)

    except Exception as e:
        print("Error:", e)
        return JsonResponse({'error': str(e)}, safe=False)