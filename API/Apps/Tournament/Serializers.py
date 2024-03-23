from rest_framework import serializers
from ..Profile.models import Profile
from .models import Tournament
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