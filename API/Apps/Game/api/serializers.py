from rest_framework import serializers
from Apps.Game.models import Game
from Apps.Profile.api.Serializers import ProfileGetSerializer
from Apps.Profile.models import Profile


class GameProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['nickname', 'profile_picture',]


class GameSerializer(serializers.ModelSerializer):
    player1 = GameProfileSerializer(read_only=True)
    player2 = GameProfileSerializer(read_only=True)
    winner = GameProfileSerializer(read_only=True)
    class Meta:
        model = Game
        fields = '__all__'
