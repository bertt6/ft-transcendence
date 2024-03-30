# chat/views.py
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from Apps.Chat.api.serializers import RoomSerializer
from Apps.Chat.models import Room


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def start_chat(request):
    username = request.data["username"]

    try:
        second_user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    try:
        room = RoomSerializer(Room.objects.get(first_user=request.user.profile, second_user=second_user.profile))
    except Room.DoesNotExist:
        try:
            room = RoomSerializer(Room.objects.get(first_user=second_user.profile, second_user=request.user.profile))
        except Room.DoesNotExist:
            room = RoomSerializer(Room.objects.create(first_user=request.user.profile, second_user=second_user.profile))
    return Response({"success": True, "room": room.data}, status=200)
