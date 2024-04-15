import asyncio
import json
import random
from asgiref.sync import async_to_sync, sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from channels.db import database_sync_to_async
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


class GameConsumer(AsyncWebsocketConsumer):
    game_states = {}
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.game_id = None
        self.game_group_name = None
        self.gameState = {}
    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.game_group_name = f'game_{self.game_id}'
        await self.channel_layer.group_add(
            self.game_group_name,
            self.channel_name
        )
        await self.accept()
        if self.game_id not in GameConsumer.game_states:
            GameConsumer.game_states[self.game_id] = self.initialize_game_state()

        await self.send_initial_state()
        asyncio.ensure_future(self.game_loop())
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.game_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        paddle = text_data_json['paddle']
        if paddle == 'player_one':
            GameConsumer.game_states[self.game_id]['player_one']['dy'] = text_data_json['dy']
        elif paddle == 'player_two':
            GameConsumer.game_states[self.game_id]['player_two']['dy'] = text_data_json['dy']

    async def send_initial_state(self):
        data = await self.get_game()
        await self.send(text_data=json.dumps({
            'state_type': 'initial_state',
            'details': data,
            'game': GameConsumer.game_states[self.game_id]
        }))
    @database_sync_to_async
    def get_game(self):
        game = Game.objects.get(id=self.game_id)
        serializer = GameSerializer(game)
        return serializer.data

    async def game_loop(self):
        while True:
            self.update()
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    'type': 'send_state',
                    'game': GameConsumer.game_states[self.game_id]
                }
            )
            await asyncio.sleep(0.01667)
    async def send_state(self, event):
        await self.send(text_data=json.dumps({
            'state_type': 'game_state',
            'game': event['game']
        }))

    def update(self):
        paddle_height = 200

        GameConsumer.game_states[self.game_id]['player_one']['paddle_y'] += GameConsumer.game_states[self.game_id]['player_one']['dy']
        GameConsumer.game_states[self.game_id]['player_one']['paddle_y'] = max(-GameConsumer.game_states[self.game_id]['canvas_height'] / 2 + paddle_height / 2,
                                                       min(GameConsumer.game_states[self.game_id]['canvas_height'] / 2 - paddle_height / 2,
                                                           GameConsumer.game_states[self.game_id]['player_one']['paddle_y']))

        GameConsumer.game_states[self.game_id]['player_two']['paddle_y'] += GameConsumer.game_states[self.game_id]['player_two']['dy']
        GameConsumer.game_states[self.game_id]['player_two']['paddle_y'] = max(-GameConsumer.game_states[self.game_id]['canvas_height'] / 2 + paddle_height / 2,
                                                       min(GameConsumer.game_states[self.game_id]['canvas_height'] / 2 - paddle_height / 2,
                                                           GameConsumer.game_states[self.game_id]['player_two']['paddle_y']))
        ball = GameConsumer.game_states[self.game_id]['ball']
        ball['x'] += ball['dx']
        ball['y'] += ball['dy']
        # Check collision with top or bottom walls
        if ball['y'] + 10 >= GameConsumer.game_states[self.game_id]['canvas_height'] / 2 or ball['y'] - 10 <= -GameConsumer.game_states[self.game_id][
            'canvas_height'] / 2:
            ball['dy'] = -ball['dy']

        paddle_one_y = GameConsumer.game_states[self.game_id]['player_one']['paddle_y']
        paddle_top = paddle_one_y - paddle_height / 2
        paddle_bottom = paddle_one_y + paddle_height / 2
        if (ball['x'] - 40 <= -GameConsumer.game_states[self.game_id]['canvas_width'] / 2 and
                paddle_top <= ball['y'] <= paddle_bottom):
            ball['dx'] = -ball['dx']
        paddle_two_y = GameConsumer.game_states[self.game_id]['player_two']['paddle_y']
        paddle_top = paddle_two_y - paddle_height / 2
        paddle_bottom = paddle_two_y + paddle_height / 2
        if (ball['x'] + 40 >= GameConsumer.game_states[self.game_id]['canvas_width'] / 2 and
                paddle_top <= ball['y'] <= paddle_bottom):
            ball['dx'] = -ball['dx']
        # Score
        if ball['x'] - 10 <= -GameConsumer.game_states[self.game_id]['canvas_width'] / 2:
            GameConsumer.game_states[self.game_id]['player_two']['score'] += 1
            ball['x'] = 0
            ball['y'] = 0
            ball['dx'] = random.choice([-10, 10])

        if ball['x'] + 10 >= GameConsumer.game_states[self.game_id]['canvas_width'] / 2:
            GameConsumer.game_states[self.game_id]['player_one']['score'] += 1
            ball['x'] = 0
            ball['y'] = 0
            ball['dx'] = random.choice([-10, 10])

    def initialize_game_state(self):
        canvas_width = 1368
        canvas_height = 600
        initial_ball_x = 0
        initial_ball_y = 0

        return {
            'canvas_width': canvas_width,
            'canvas_height': canvas_height,
            'player_one': {'paddle_y': 0, 'paddle_x': -canvas_width / 2 + 20, 'dy': 0, 'score': 0},
            'player_two': {'paddle_y': 0, 'paddle_x': canvas_width / 2 - 20, 'dy': 0, 'score': 0},
            'ball': {'x': initial_ball_x, 'y': initial_ball_y, 'dx': 10, 'dy': 10},
        }

    async def players_count(self):
        return await self.channel_layer.group_count(self.game_group_name)
