# chat/consumers.py
import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth.models import User
from rest_framework_simplejwt.backends import TokenBackend
from Apps.Chat.models import Message
from urllib.parse import parse_qsl

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        print(self.room_name)
        self.room_group_name = "chat_%s" % self.room_name

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
        query_params = dict(parse_qsl(self.scope['query_string'].decode('utf-8')))
        valid_data = TokenBackend(algorithm='HS256').decode(query_params['token'], verify=False)
        userId = valid_data['user_id']
        user = User.objects.get(id=userId)
        Message.objects.create(content=message, user=user.profile, room_id=self.room_name)

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {
                "type": "chat_message",
                "message": message,
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event["message"]
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            "message": message,
        }))