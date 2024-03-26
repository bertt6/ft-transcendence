from django.contrib.auth.models import User
from rest_framework import serializers
from ..models import Profile


class ProfileGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"


class ProfilePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['nickname']