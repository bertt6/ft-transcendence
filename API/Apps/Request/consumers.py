from asgiref.sync import sync_to_async, async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
import json

from django.db.models import Q

from Apps.Profile.models import Profile
from Apps.Request.models import Request


class RequestConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.nickname = self.scope["url_route"]["kwargs"]["nickname"]
        self.group_name = "requests"
        self.channel_name = f"nickname_{self.nickname}"  # Set the channel name here
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        await self.create_request(text_data_json)
        receiver_nickname = text_data_json["receiver"]
        receiver_channel_name = f"nickname_{receiver_nickname}"
        await self.channel_layer.send(
            receiver_channel_name,
            {
                "type": "create_request_message",
                "sender": text_data_json["sender"],
                "receiver": receiver_nickname,
                "request_type": text_data_json["request_type"]
            }
        )

    async def create_request_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': event['type'],
            'sender': event['sender'],
            'receiver': event['receiver'],
            'request_type': event['request_type'],
        }))

    async def create_request(self, event):
        sender = event["sender"]
        receiver = event["receiver"]
        request_type = event["request_type"]
        sender_profile = await sync_to_async(Profile.objects.get)(nickname=sender)
        receiver_profile = await sync_to_async(Profile.objects.get)(nickname=receiver)
        try:
            await sync_to_async(Request.objects.get)(
                (Q(sender=sender_profile) & Q(receiver=receiver_profile)) |
                (Q(sender=receiver_profile) & Q(receiver=sender_profile))
            )
        except Request.DoesNotExist:
            await sync_to_async(Request.objects.create)(sender=sender_profile, receiver=receiver_profile,
                                                        type=request_type)
