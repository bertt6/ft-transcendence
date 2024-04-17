from rest_framework import serializers
from ..Profile.models import Profile
from .models import Tournament, Match, Round


class MatchGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = "__all__"

class RoundSerializer(serializers.ModelSerializer):
    matches = MatchGetSerializer(many=True)
    class Meta:
        model = Round
        fields = ['round_number', 'matches', 'participants']


class TournamentGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = "__all__"


class TournamentPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ['name', 'max_participants', 'created_by', 'current_participants']

    def validate(self, val):
        if(val['max_participants'] <= 2):
            raise serializers.ValidationError("Maximum participants must be greater than two")
        return val;