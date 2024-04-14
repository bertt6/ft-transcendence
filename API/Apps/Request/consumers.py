from asgiref.sync import sync_to_async, async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
import json

from django.db.models import Q

from Apps.Profile.models import Profile
from Apps.Request.models import Request


class RequestConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.nickname = self.scope["url_route"]["kwargs"]["nickname"]
        self.group_name = self.nickname
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


    async def create_request_message(self, event):
        await self.send(text_data=json.dumps({
            'sender': event['sender'],
            'receiver': event['receiver'],
            'request_type': event['request_type'],
            'request_id': str(event['request_id'])
        }))

    async def create_request(self, event):
        sender = event["sender"]
        receiver = event["receiver"]
        request_type = event["request_type"]
        sender_profile = await sync_to_async(Profile.objects.get)(nickname=sender)
        receiver_profile = await sync_to_async(Profile.objects.get)(nickname=receiver)
        try:
            request = await sync_to_async(Request.objects.get)(
                Q(sender=sender_profile, receiver=receiver_profile, type=request_type) |
                Q(sender=receiver_profile, receiver=sender_profile, type=request_type)
            )
        except Request.DoesNotExist:
            request = await sync_to_async(Request.objects.create)(sender=sender_profile, receiver=receiver_profile,
                                                                  type=request_type)
        await self.channel_layer.group_send(
            receiver,
            {
                "type": "create_request_message",
                "sender": sender,
                "receiver": receiver,
                "request_type": request_type,
                "request_id": str(request.id),
            }
        )
