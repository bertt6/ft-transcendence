import json
from channels.generic.websocket import WebsocketConsumer
from Apps.OnlineUsers.cache import set_online_user, get_online_users, remove_online_user


class OnlineUsersConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        set_online_user(self.user_id)
        self.send(text_data=json.dumps({"online_users": get_online_users()}))

    def disconnect(self, code):
        remove_online_user(self.user_id)

