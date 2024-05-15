from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Spot
from .serializer import SpotSerializer

class SpotViewSet(viewsets.ModelViewSet):
    queryset = Spot.objects.all()
    serializer_class = SpotSerializer
    filter_fields = ('id', 'name', 'address', 'phone_number', 'lat', 'lon', 'detail', 'open_time', 'close_time', 'business_time', 'regular_dayoff', 'url', 'g_speciality', 'g_shopping', 'g_hotel', 'g_sightseeing', 'close_down')
