from rest_framework import serializers
from .models import Spot #DB名

import django_filters.rest_framework

class SpotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Spot
        # 返したいカラムをfieldsで指定できる
        fields = ('id', 'name', 'address', 'phone_number', 'lat', 'lon', 'detail', 'open_time', 'close_time', 'business_time', 'regular_dayoff', 'url', 'g_speciality', 'g_shopping', 'g_hotel', 'g_sightseeing', 'close_down')
