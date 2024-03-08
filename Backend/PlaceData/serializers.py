# serializers.py
from rest_framework import serializers
from .models import Place_Data

class PlaceDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Place_Data
        fields = '__all__'
