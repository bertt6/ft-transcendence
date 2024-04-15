from rest_framework import serializers
from Apps.Game.models import Game
from Apps.Profile.api.Serializers import ProfileGetSerializer


class GameSerializer(serializers.ModelSerializer):
    player1 = ProfileGetSerializer(read_only=True)
    player2 = ProfileGetSerializer(read_only=True)
    class Meta:
        model = Game
        fields = '__all__'