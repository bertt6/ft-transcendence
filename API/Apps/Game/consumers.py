import json

from asgiref.sync import async_to_sync, sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer

from Apps.Game.api.serializers import GameSerializer
from Apps.Game.cache import get_players_in_que, add_player_in_que, clear_players_in_que
from Apps.Game.models import Game
from Apps.Profile.api.Serializers import ProfileGetSerializer
from Apps.Profile.models import Profile


class MatchMakingConsumer(WebsocketConsumer):
    def connect(self):
        self.profile = ProfileGetSerializer(
            Profile.objects.get(nickname=self.scope['url_route']['kwargs']['nickname'])).data
        async_to_sync(self.channel_layer.group_add)(
            'matchmaking',
            self.channel_name
        )
        self.send(text_data=json.dumps({
            'message': 'Searching for a game...'
        }))
        add_player_in_que(self.profile)
        self.check_game()
        self.accept()

    def disconnect(self, close_code):
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
        if len(players_in_que) == 1:
            self.send(text_data=json.dumps({
                'message': 'Waiting for another player...'
            }))
        else:
            player1, player2 = players_in_que
            clear_players_in_que()
            game = Game.objects.create(player1_id=player1['id'], player2_id=player2['id'])
            async_to_sync(self.channel_layer.group_send)(
                'matchmaking', {
                    'type': 'match_making_message',
                    'message': 'Game found! You are now playing!',
                    'game': GameSerializer(game).data,
                }
            )


class GameConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.game_group_name = None
        self.game_id = None

    def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.game_group_name = f'game_{self.game_id}'
        self.channel_layer.group_add(
            self.game_group_name,
            self.channel_name
        )
        self.accept()
        self.send_initial_state()

    def disconnect(self, close_code):
        self.channel_layer.group_discard(
            self.game_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)

    def send_initial_state(self):
        game = Game.objects.get(id=self.game_id)
        serializer = GameSerializer(game)
        self.send(text_data=json.dumps({
            'details': serializer.data,
            'game': {}
        }))
