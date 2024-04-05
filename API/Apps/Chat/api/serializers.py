from rest_framework import serializers

from Apps.Chat.models import Message, Room
from Apps.Profile.api.Serializers import ProfileGetSerializer


class MessageSerializer(serializers.ModelSerializer):
    user = ProfileGetSerializer(read_only=True)
    class Meta:
        model = Message
        fields = "__all__"

class RoomSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(read_only=True, many=True)

    class Meta:
        model = Room
        fields = '__all__'