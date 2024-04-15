import asyncio
import json
import threading
import time

import redis
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from channels.layers import get_channel_layer
from Apps.Game.api.serializers import GameSerializer
from Apps.Game.cache import get_players_in_que, add_player_in_que, clear_players_in_que, remove_player_in_que
from Apps.Game.models import Game
from Apps.Profile.api.Serializers import ProfileGetSerializer
from Apps.Profile.models import Profile
from Apps.Game.matchmaking import match


class MatchMakingConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.profile = ProfileGetSerializer(Profile.objects.get(nickname=self.scope['url_route']['kwargs']['nickname'])).data
        async_to_sync(self.channel_layer.group_add)(
            'player-%s' %self.profile['nickname'],
            self.channel_name
        )
        add_player_in_que(self.profile)
        self.check_game()

    def disconnect(self, close_code):
        remove_player_in_que(self.profile)
        self.channel_layer.group_discard(
            'matchmaking',
            self.channel_name,
        )

    def receive(self, text_data):
        pass

    def match_making_message(self, event):
        self.send(text_data=json.dumps({
            'message': event['message'],
            'game': event['game']
        }))

    def check_game(self):
        players_in_que = get_players_in_que()
        self.send(text_data=json.dumps({
            'message': 'Searching for a game...'
        }))
        if len(players_in_que) == 2:
            threading.Thread(target=self.match_making).start()

    def match_making(self):
        players = sorted(get_players_in_que(), key=lambda x: x['mmr'])
        while len(players) != 0:
            ideal_mmr = 1
            while True and len(players) > 1:
                players = match(players, ideal_mmr)
                if len(players) == 2:
                    Game.objects.create(player1=Profile.objects.get(id=players[0]['id']), player2=Profile.objects.get(id=players[1]['id']))
                    self.send(text_data=json.dumps({
                        'message': 'Match found! Ready for playing!',
                        'game': None,
                    }))
                    async_to_sync(self.channel_layer.group_send)(
                        f'player-{players[1]['nickname'] if self.profile['nickname'] == players[0]['nickname'] else players[0]['nickname']}', {
                            "type": "match_making_message",
                            "message": 'Match found! Ready for playing!',
                            "game": None,
                        }
                    )
                    break
                ideal_mmr += 0.00001
            players = sorted(get_players_in_que(), key=lambda x: x['mmr'])
            print(len(players))
