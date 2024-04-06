# chat/views.py
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from Apps.Chat.api.serializers import RoomSerializer
from Apps.Chat.models import Room
from Apps.Profile.models import Profile


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def start_chat(request):
    nickname = request.data.get("nickname")
    first_user = request.user.profile
    second_user = Profile.objects.get(nickname=nickname)
    if not second_user:
        return Response({"error": "User not found"}, status=404)
    room = Room.objects.get(
        (Q(first_user=first_user) & Q(second_user=second_user)) |
        (Q(first_user=second_user) & Q(second_user=first_user))
    )
    if not room:
        room = Room.objects.create(first_user=request.user.profile, second_user=second_user)
    room_serializer = RoomSerializer(room)
    return Response({"success": True, "room": room_serializer.data}, status=200)