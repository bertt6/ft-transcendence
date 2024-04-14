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
        canvas_width = 1368
        canvas_height = 600
        initial_ball_x = 0
        initial_ball_y = 0

        self.gameState = {
            'canvas_width': canvas_width,
            'canvas_height': canvas_height,
            'player_one': {'paddle_y': 0,'paddle_x':20, 'dy': 0, 'score': 0},
            'player_two': {'paddle_y': 0,'paddle_x':canvas_width - 20, 'dy': 0, 'score': 0},
            'ball': {'x': initial_ball_x, 'y': initial_ball_y, 'dx': 10, 'dy': 10},
        }
        await self.send_initial_state()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.game_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        paddle = text_data_json['paddle']
        if paddle == 'player_one':
            self.gameState['player_one']['dy'] = text_data_json['dy']
        elif paddle == 'player_two':
            self.gameState['player_two']['dy'] = text_data_json['dy']
        self.update()
        await self.send(text_data=json.dumps({
            'state_type': 'game_state',
            'game': self.gameState
        }))

    async def send_initial_state(self):
        data = await self.get_game()
        await self.send(text_data=json.dumps({
            'state_type': 'initial_state',
            'details': data,
            'game': self.gameState
        }))

    @database_sync_to_async
    def get_game(self):
        game = Game.objects.get(id=self.game_id)
        serializer = GameSerializer(game)
        return serializer.data

    async def game_loop(self):
        await self.update()
        await self.send(text_data=json.dumps({
            'state_type': 'game_state',
            'game': self.gameState
        }))
        await asyncio.sleep(0.01)

    import random

    def update(self):
        # Update player paddles positions
        self.gameState['player_one']['paddle_y'] += self.gameState['player_one']['dy']
        # Ensure player one's paddle stays within the canvas bounds
        self.gameState['player_one']['paddle_y'] = max(-200, min(200, self.gameState['player_one']['paddle_y']))

        self.gameState['player_two']['paddle_y'] += self.gameState['player_two']['dy']
        # Ensure player two's paddle stays within the canvas bounds
        self.gameState['player_two']['paddle_y'] = max(-200, min(200, self.gameState['player_two']['paddle_y']))

        ball = self.gameState['ball']
        ball['x'] += ball['dx']
        ball['y'] += ball['dy']

        # Check collision with top or bottom walls
        if ball['y'] + 10 >= self.gameState['canvas_height'] or ball['y'] - 10 <= 0:
            print('Collision with top or bottom walls')
            ball['dy'] = -ball['dy']

        # Collision with player one's paddle
        paddle_one_y = self.gameState['player_one']['paddle_y']
        print("paddle",paddle_one_y,"ball", ball['y'])
        if (
                ball['x'] - 10 <= 20 and
                paddle_one_y - 100 <= ball['y'] <= paddle_one_y + 100
        ):
            print('Collision with player one paddle')
            ball['dx'] = -ball['dx']

        # Collision with player two's paddle
        paddle_two_y = self.gameState['player_two']['paddle_y']
        if (
                ball['x'] + 10 >= self.gameState['canvas_width'] - 20 and
                paddle_two_y - 100 <= ball['y'] <= paddle_two_y + 100
        ):
            print('Collision with player two paddle')
            ball['dx'] = -ball['dx']

        # Score
        if ball['x'] - 10 <= 0:
            # Player two scores
            self.gameState['player_two']['score'] += 1
            ball['x'] = 0
            ball['y'] = 0
            ball['dx'] = random.choice([-10, 10])  # Random direction

        if ball['x'] + 10 >= self.gameState['canvas_width']:
            # Player one scores
            self.gameState['player_one']['score'] += 1
            ball['x'] = 0
            ball['y'] = 0
            ball['dx'] = random.choice([-10, 10])  # Random direction

    async def players_count(self):
        return await self.channel_layer.group_count(self.game_group_name)
