import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from channels.layers import get_channel_layer

from Apps.Game.models import Game
from Apps.Profile.models import Profile

class MatchMakingConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.user = async_to_sync(Profile.objects.get(nickname=self.scope['url_route']['kwargs']['nickname']))
        print(self.channel_name)
        print('ASDHGAGSJDJASFGHASDFGFDGSAFGHJSDAGFSADGFHAJDGFHJSADFGHSDAGF')
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
        if len(get_channel_layer().group_channel('matchmaking')) == 1:
            self.send(text_data=json.dumps({
                'message': 'Waiting for another player...'
            }))
        else:
            player1, player2 = self.channel_layer.group_channel_layer('matchmaking')
            Game.objects.create(player1=player1, player2=player2)
            async_to_sync(self.channel_layer.group_send)(
                'matchmaking', {
                    'type': 'match_making_message',
                    'message': 'Game found! You are now playing!'
                }
            )
