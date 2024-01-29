from django.db import models
from django.contrib.postgres.fields import ArrayField

class Place_Data(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    description = models.TextField()
    shortDescription = models.TextField()
    activities = ArrayField(models.CharField(max_length=255), null=True, blank=True)
    amenities = ArrayField(models.CharField(max_length=255), null=True, blank=True)
    image = ArrayField(models.CharField(max_length=10000), null=True, blank=True)

    class Meta:
        db_table = 'PlaceData'    
