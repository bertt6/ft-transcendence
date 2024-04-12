import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer


class MatchMakingConsumer(AsyncWebsocketConsumer):
    def connect(self):
        self.accept()
        self.channel_layer.group_add(
            'matchmaking',
            self.channel_name,
        )
        self.send(text_data=json.dumps({
            'message': 'Searching for a game...'
        }))
        self.check_game()

    def disconnect(self, close_code):
        self.channel_layer.group_discard(
            'matchmaking',
            self.channel_name,
        )

    def receive(self, text_data):
        pass

    def match_making_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'message': message
        }))

    def check_game(self):
        if len(self.channel_layer.group_channel_layer('matchmaking')) == 1:
            self.send(text_data=json.dumps({
                'message': 'Waiting for another player...'
            }))
            self.check_game()
        else:
            player1, player2 = self.channel_layer.group_channel_layer('matchmaking')
            async_to_sync(self.channel_layer.group_send)(
                'matchmaking', {
                    'type': 'match_making_message',
                    'message': 'Game found! You are now playing!'
                }
            )

