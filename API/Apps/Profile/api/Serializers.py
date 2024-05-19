from django.contrib.auth.models import User
from rest_framework import serializers
from ..models import Profile, Stats
from ...Game.models import Game


class ProfileGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"


class ProfilePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['nickname', 'bio', 'profile_picture']




class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name']


class ProfileFriendsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ['friends', 'nickname', 'user', 'profile_picture', "id"]


class ProfileStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stats
        fields = ['total_games', 'total_wins', 'total_losses', 'points']


class ProfileBlockedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['nickname', 'profile_picture']


class ProfileGameSerializer(serializers.ModelSerializer):
    player1 = ProfileBlockedSerializer(read_only=True)
    player2 = ProfileBlockedSerializer(read_only=True)
    winner = ProfileBlockedSerializer(read_only=True)

    class Meta:
        model = Game
        fields = ['date', 'player1', 'player2', 'winner']
