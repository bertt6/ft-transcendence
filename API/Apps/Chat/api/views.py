# chat/views.py
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from Apps.Chat.api.serializers import RoomSerializer, MessageSerializer
from Apps.Chat.models import Room, Message
from Apps.Profile.models import Profile


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def start_chat(request):
    nickname = request.data.get("nickname")
    first_user = request.user.profile
    second_user = Profile.objects.get(nickname=nickname)
    if (not second_user or second_user.blocked_users.filter(id=first_user.id).exists()
            or first_user.blocked_users.filter(id=second_user.id).exists()):
        return Response({"error": "User not found"}, status=404)
    try:
        room = Room.objects.get(
            (Q(first_user=first_user) & Q(second_user=second_user)) |
            (Q(first_user=second_user) & Q(second_user=first_user))
        )
    except Room.DoesNotExist:
        room = Room.objects.create(first_user=request.user.profile, second_user=second_user)
    room_serializer = RoomSerializer(room)
    return Response({"success": True, "room": room_serializer.data}, status=200)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_messages(request, room_id):
    try:
        messages = Message.objects.filter(room=room_id)
        paginator = PageNumberPagination()
        paginator.page_size = 10
        paginated_data = paginator.paginate_queryset(messages, request)
        serializer = MessageSerializer(paginated_data, many=True)
        return paginator.get_paginated_response({"success": True, "messages": serializer.data})
    except Message.DoesNotExist:
        return Response({"error": "Messages not found"}, status=404)
