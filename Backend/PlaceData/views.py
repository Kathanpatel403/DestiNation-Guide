# views.py
from rest_framework.response import Response
from .models import Place_Data
from .serializers import PlaceDataSerializer
from rest_framework.decorators import api_view
from django.http import JsonResponse
from .Recommendation import give_rec
import json


@api_view(['GET'])
def get_all_destinations(request):
    print("Request received")  # Add print statements for debugging
    destinations = Place_Data.objects.all()
    serializer = PlaceDataSerializer(destinations, many=True)
    return Response({'destinations': serializer.data})

@api_view(['GET'])
def get_recommendations(request, place_name):
    try:
        # Get recommendations for the given place
        recommendations = give_rec(place_name)
        
        # Fetch details of each recommendation from the database
        recommended_places_data = []
        for recommendation in recommendations:
            place_data = Place_Data.objects.filter(Name=recommendation).first()
            if place_data:
                serializer = PlaceDataSerializer(place_data)
                recommended_places_data.append(serializer.data)
        
        return Response({'recommendations': recommended_places_data})
    except Exception as e:
        return Response({'error': str(e)}, status=500)


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


@api_view(['GET'])
def get_place_details(request, place_name):
    try:
        place = Place_Data.objects.get(name=place_name)
        serializer = PlaceDataSerializer(place)
        return Response({'place': serializer.data})
    except Place_Data.DoesNotExist:
        return Response({'error': 'Place not found'}, status=404)
    

@api_view(['GET'])
def get_destinations_sorted_by_likes(request):
    try:
        destinations = Place_Data.objects.order_by('-Likes')[:10]  # Sort destinations by Likes in descending order and limit to 10
        serializer = PlaceDataSerializer(destinations, many=True)
        return Response({'destinations': serializer.data})
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    



@api_view(['GET'])
def get_places_by_category(request, category):
    if request.method == 'GET':
        # Query places based on the provided category
        places = Place_Data.objects.filter(Category__icontains=category)
        
        # Serialize the places data
        serialized_places = []
        for place in places:
            # Preprocess categories to remove leading and trailing spaces
            categories = [cat.strip() for cat in place.Category]
            # Check if the specified category is in the place's categories
            if category.lower() in [cat.lower() for cat in categories]:
                serialized_places.append({
                    'name': place.Name,
                    'category': place.Category,
                    # Add other fields you want to include in the response
                })
        
        return JsonResponse({'places': serialized_places}, status=200)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405) 

    
       