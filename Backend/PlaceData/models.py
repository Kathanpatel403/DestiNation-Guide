from django.db import models
from django.contrib.postgres.fields import ArrayField

class Place_Data(models.Model):
    Place_id =  models.IntegerField()
    Name = models.CharField(max_length=255)
    Category = models.CharField(max_length=255)
    City = models.CharField(max_length=255)
    State = models.CharField(max_length=255)
    Country = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    LongDescription = models.TextField()
    ShortDescription = models.TextField()
    Activities = ArrayField(models.CharField(max_length=255), null=True, blank=True)
    Amenities = ArrayField(models.CharField(max_length=255), null=True, blank=True)
    Image = ArrayField(models.CharField(max_length=10000), null=True, blank=True)
    Timings = models.TextField()
    Fee = models.TextField()
    FeeLink = models.TextField()
    BMTV = models.CharField(max_length=255)
    TIP = models.IntegerField()
    Likes = models.IntegerField()

    class Meta:
        db_table = 'PlaceData'    
