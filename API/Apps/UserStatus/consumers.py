import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from Apps.UserStatus.cache import set_online_user, get_online_users, remove_online_user, update_online_user


class OnlineUsersConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.nickname = self.scope['url_route']['kwargs']['nickname']
        self.group_name = "online_users_group"
        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name
        )
        set_online_user({'nickname': self.nickname, 'status': 'online'})
        self.send_online_users()

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )
        remove_online_user(self.nickname)
        self.send_online_users()
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        if text_data_json["request_type"] == "get_user_status":
            self.send_online_users()
        if text_data_json["request_type"] == "set_status":
            print(text_data_json)
            update_online_user(text_data_json["nickname"], text_data_json["status"])
            self.send_online_users()

    def send_online_users(self):
        online_users = get_online_users()
        async_to_sync(self.channel_layer.group_send)(
            self.group_name, {
                "type": "send_online_users_to_user",
                "online_users": online_users,
            }
        )

    def send_online_users_to_user(self, event):
        self.send(text_data=json.dumps({"online_users": event["online_users"]}))
