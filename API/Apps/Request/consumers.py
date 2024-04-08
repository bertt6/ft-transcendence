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
        await self.channel_layer.group_send(
            self.group_name,
            {
                "sender": text_data_json["sender"],
                "receiver": text_data_json["receiver"],
                "request_type": text_data_json["request_type"]
            }
        )

    async def create_request(self, event):
        print(event)
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
