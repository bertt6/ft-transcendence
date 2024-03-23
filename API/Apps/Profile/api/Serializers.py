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
        fields = ['nickname', 'bio']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name']


class ProfileFriendsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ['friends','nickname','user']