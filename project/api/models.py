from django.db import models

# Create your models here.
class Spot(models.Model):
    id = models.AutoField(blank=True, null=False, primary_key=True)
    name = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    phone_number = models.TextField(blank=True, null=True)
    lat = models.FloatField(blank=True, null=True)
    lon = models.FloatField(blank=True, null=True)
    detail = models.TextField(blank=True, null=True)
    open_time = models.TextField(blank=True, null=True)
    close_time = models.TextField(blank=True, null=True)
    business_time = models.TextField(blank=True, null=True)
    regular_dayoff = models.TextField(blank=True, null=True)
    url = models.TextField(blank=True, null=True)
    g_speciality = models.IntegerField(blank=True, null=True)
    g_shopping = models.IntegerField(blank=True, null=True)
    g_hotel = models.IntegerField(blank=True, null=True)
    g_sightseeing = models.IntegerField(blank=True, null=True)
    close_down = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'spot'
