import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth.models import User
from rest_framework_simplejwt.backends import TokenBackend
from Apps.Chat.models import Message
from urllib.parse import parse_qsl

from Apps.Profile.models import Profile


class ChatConsumer(WebsocketConsumer):

    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "chat%s" % self.room_name
        self.profile = Profile.objects.get(nickname=self.scope["url_route"]["kwargs"]["nickname"])

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        if message == "":
            return
        Message.objects.create(content=message, user=self.profile, room_id=self.room_name)

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {
                "type": "chat_message",
                "message": message,
                "nickname": self.profile.nickname,
                "id": self.profile.id,
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event["message"]
        user = event["nickname"]
        id = event["id"]
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            "message": message,
            "user": user,
            "id": id,
        }))