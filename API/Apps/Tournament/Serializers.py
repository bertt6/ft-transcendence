from rest_framework import serializers

from ..Profile.api.Serializers import ProfileGetSerializer
from ..Profile.models import Profile
from .models import Tournament, Round
from ..Game.api.serializers import GameSerializer
from ..Game.models import Game


class GameGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = "__all__"


class RoundSerializer(serializers.ModelSerializer):
    matches = GameGetSerializer(many=True, read_only=True)

    class Meta:
        model = Round
        fields = ['round_number', 'matches', 'participants']


class TournamentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['nickname', 'profile_picture']


class TournamentGetSerializer(serializers.ModelSerializer):
    current_participants = TournamentProfileSerializer(many=True, read_only=True)

    class Meta:
        model = Tournament
        fields = "__all__"


class TournamentPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ['id', 'name', 'max_participants', 'created_by']

    def validate(self, val):
        if val['max_participants'] <= 2:
            raise serializers.ValidationError("Maximum participants must be greater than two")
        return val
