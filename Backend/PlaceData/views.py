# views.py
from rest_framework.response import Response
from .models import Place_Data
from .serializers import PlaceDataSerializer
from rest_framework.decorators import api_view
from django.http import JsonResponse
from .Recommendation import give_rec  # Import the recommendation function

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