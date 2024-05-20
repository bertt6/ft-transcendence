import asyncio
import json
import random
import threading
import time
import uuid
from asgiref.sync import async_to_sync, sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from channels.db import database_sync_to_async
from Apps.Game.api.serializers import GameSerializer
from Apps.Game.cache import get_players_in_que, add_player_in_que, remove_player_in_que, get_players_in_game, \
    add_player_in_game, clear_player_in_game, set_cache, get_player_count_in_game
from Apps.Game.models import Game
from Apps.Profile.api.Serializers import ProfileGetSerializer
from Apps.Profile.models import Profile
from Apps.Game.matchmaking import match
from django.core.serializers.json import DjangoJSONEncoder


class MatchMakingConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.profile = ProfileGetSerializer(
            Profile.objects.get(nickname=self.scope['url_route']['kwargs']['nickname'])).data
        async_to_sync(self.channel_layer.group_add)(
            'player-%s' % self.profile['nickname'],
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

    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        if text_data_json['request_type'] == 'disconnect':
            self.close()

    def match_making_message(self, event):
        self.send(text_data=json.dumps({
            'message': event['message'],
            'game_id': event['game_id']
        }))

    def check_game(self):
        players_in_que = get_players_in_que()

        if len(players_in_que) == 2:
            threading.Thread(target=self.match_making).start()  # opening thread because socket time out while true


    def match_making(self):
        players = sorted(get_players_in_que(), key=lambda x: x['mmr'])
        while len(players) != 0:
            ideal_mmr = 1
            while True and len(players) > 1:
                matched_players = match(players, ideal_mmr)
                if len(matched_players) == 2:
                    game = Game.objects.create(player1=Profile.objects.get(id=matched_players[0]['id']),
                                               player2=Profile.objects.get(id=matched_players[1]['id']))
                    self.send(text_data=json.dumps({
                        'message': f'Match found! Ready for playing!',
                        'game_id': GameSerializer(game).data['id'],
                    }))
                    async_to_sync(self.channel_layer.group_send)(
                        f'player-{matched_players[1]['nickname'] if self.profile['nickname'] == matched_players[0]['nickname'] else matched_players[0]['nickname']}',
                        {
                            "type": "match_making_message",
                            "message": 'Match found! Ready for playing!',
                            "game_id": GameSerializer(game).data['id'],
                        }
                    )
                    players = sorted(get_players_in_que(), key=lambda x: x['mmr'])
                    break
                time.sleep(0.1)
                ideal_mmr += 0.5  # up to value and time intervals can be added
                players = sorted(get_players_in_que(), key=lambda x: x['mmr'])


class GameConsumer(AsyncWebsocketConsumer):
    game_states = {}

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.error = False
        self.game_id = None
        self.game_group_name = None
        self.gameState = {}
        self.stop_event = threading.Event()
        self.current_game = None

    async def connect(self):
        await self.accept()
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.game_group_name = f'game_{self.game_id}'
        await self.channel_layer.group_add(
            self.game_group_name,
            self.channel_name
        )
        if self.game_id not in GameConsumer.game_states:
            GameConsumer.game_states[self.game_id] = self.initialize_game_state({
                'player1_score': 0,
                'player2_score': 0,
                'dx': random.choice([-5, 5]),
                'dy': random.choice([-5, 5]),
            })
        await self.send_initial_state()

    async def disconnect(self, close_code):
        clear_player_in_game(self.game_id, self.channel_name)
        await self.channel_layer.group_discard(
            self.game_group_name,
            self.channel_name
        )

    async def handle_join(self, data):
        player1_nickname = self.current_game['player1']['nickname']
        player2_nickname = self.current_game['player2']['nickname']
        if data['nickname'] == player1_nickname:
            add_player_in_game(self.game_id, 'player_one', data, self.channel_name)
        elif data['nickname'] == player2_nickname:
            add_player_in_game(self.game_id, 'player_two', data, self.channel_name)
        else:
            add_player_in_game(self.game_id, 'spectator', data, self.channel_name)
        if ('task' not in GameConsumer.game_states[self.game_id]
                and get_player_count_in_game(self.game_id) == 2):
            await asyncio.sleep(3)
            self.thread = threading.Thread(target=asyncio.run, args=(self.game_loop(),))
            self.thread.start()
            GameConsumer.game_states[self.game_id]['task'] = True
        elif (get_player_count_in_game(self.game_id) != 2):  # if not come other players wait 30sec and finish game
            i = 300
            while i == 0:
                if get_player_count_in_game(self.game_id) == 2:
                    break
                await asyncio.sleep(0.1)
                i = i - 1

            if i == 0 and (get_player_count_in_game(self.game_id) == 1):
                game = await self.get_game()
                players = get_players_in_game(self.game_id)
                await self.finish_game(players[0]["nickname"])
                await self.channel_layer.group_send(
                    self.game_group_name,
                    {
                        'type': 'send_finish_state',
                        'game': GameConsumer.game_states[self.game_id],
                        'winner': players[0],
                        'tournament_id': str(game['tournament'])
                    }
                )

    async def receive(self, text_data):
        if self.error:
            return
        text_data_json = json.loads(text_data)
        try:
            if text_data_json['send_type'] == 'join':
                await self.handle_join(text_data_json)
            return
        except KeyError:
            pass
        paddle = text_data_json['paddle']
        if paddle == 'player_one':
            GameConsumer.game_states[self.game_id]['player_one']['dy'] = text_data_json['dy']
        elif paddle == 'player_two':
            GameConsumer.game_states[self.game_id]['player_two']['dy'] = text_data_json['dy']

    async def send_initial_state(self):
        data = await self.get_game()
        if data is None:
            await self.send(text_data=json.dumps({
                'state_type': 'error_state',
                'status': '404',
                'title': 'Game not found',
                'message': 'Game with this ID does not exist.'
            })
            )
            self.error = True
            await self.close()
            return
        self.current_game = data
        if data['is_finished'] is True:
            await self.send(text_data=json.dumps({
                'state_type': 'finish_state',
                'game': GameConsumer.game_states[self.game_id],
                'winner': data['winner']
            }))
            await self.close()
            return
        self.player1 = data['player1']
        self.player2 = data['player2']
        await self.send(text_data=json.dumps({
            'state_type': 'initial_state',
            'details': data,
            'game': GameConsumer.game_states[self.game_id]
        }, cls=DjangoJSONEncoder))

    async def send_score_state(self, event):
        await self.send(text_data=json.dumps({
            'state_type': 'score_state',
            'game': event['game'],
        }))

    async def send_finish_state(self, event):
        await self.send(text_data=json.dumps({
            'state_type': 'finish_state',
            'game': event['game'],
            'winner': event['winner'],
            'tournament_id': str(event['tournament_id'])
        }))
        await self.close()

    @database_sync_to_async
    def get_game(self):
        if self.current_game is not None:
            return self.current_game
        try:
            uuid_obj = uuid.UUID(self.game_id)
        except ValueError:
            return None
        try:
            game = Game.objects.get(id=self.game_id)
        except Game.DoesNotExist:
            return None
        serializer = GameSerializer(game)
        return serializer.data

    @database_sync_to_async
    def finish_game(self, winner):
        game = Game.objects.get(id=self.game_id)
        winner = Profile.objects.get(nickname=winner)
        game.winner = winner
        game.is_finished = True
        game.save()

    async def game_loop(self):
        while True:
            data = get_players_in_game(self.game_id)
            await self.update()
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    'type': 'send_state',
                    'game': GameConsumer.game_states[self.game_id],
                    'spectators': [player for player in data if player['player'] == 'spectator']
                }
            )
            await asyncio.sleep(0.016)
            if self.stop_event.isSet() or get_player_count_in_game(self.game_id) == 0:
                return


    async def send_state(self, event):
        await self.send(text_data=json.dumps({
            'state_type': 'game_state',
            'game': event['game'],
            'spectators': event['spectators']
        }))

    async def update(self):
        paddle_height = 200
        ball_speed = 1.0006

        winner_ball_count = 20

        player1_score = GameConsumer.game_states[self.game_id]['player_one']['score']
        player2_score = GameConsumer.game_states[self.game_id]['player_two']['score']

        GameConsumer.game_states[self.game_id]['player_one']['paddle_y'] += \
            GameConsumer.game_states[self.game_id]['player_one']['dy']
        GameConsumer.game_states[self.game_id]['player_one']['paddle_y'] = max(
            -GameConsumer.game_states[self.game_id]['canvas_height'] / 2 + paddle_height / 2,
            min(GameConsumer.game_states[self.game_id]['canvas_height'] / 2 - paddle_height / 2,
                GameConsumer.game_states[self.game_id]['player_one']['paddle_y']))

        GameConsumer.game_states[self.game_id]['player_two']['paddle_y'] += \
            GameConsumer.game_states[self.game_id]['player_two']['dy']
        GameConsumer.game_states[self.game_id]['player_two']['paddle_y'] = max(
            -GameConsumer.game_states[self.game_id]['canvas_height'] / 2 + paddle_height / 2,
            min(GameConsumer.game_states[self.game_id]['canvas_height'] / 2 - paddle_height / 2,
                GameConsumer.game_states[self.game_id]['player_two']['paddle_y']))
        ball = GameConsumer.game_states[self.game_id]['ball']
        ball['x'] += ball['dx']
        ball['y'] += ball['dy']

        # Check collision with top or bottom walls
        if ball['y'] + 10 >= GameConsumer.game_states[self.game_id]['canvas_height'] / 2 or ball['y'] - 10 <= - \
                GameConsumer.game_states[self.game_id][
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

        GameConsumer.game_states[self.game_id]['ball']['dx'] *= ball_speed
        GameConsumer.game_states[self.game_id]['ball']['dy'] *= ball_speed

        # Score
        if ball['x'] - 10 <= -GameConsumer.game_states[self.game_id]['canvas_width'] / 2:
            GameConsumer.game_states[self.game_id]['player_two']['score'] += 1
            GameConsumer.game_states[self.game_id] = self.initialize_game_state({
                'player1_score': player1_score,
                'player2_score': player2_score + 1,
                'dx': -5,
                'dy': random.choice([-5, 5])
            })
            if GameConsumer.game_states[self.game_id]['player_two']['score'] >= winner_ball_count:
                game = await self.get_game()
                await self.finish_game(self.player2['nickname'])
                await self.channel_layer.group_send(
                    self.game_group_name,
                    {
                        'type': 'send_finish_state',
                        'game': GameConsumer.game_states[self.game_id],
                        'winner': self.player2,
                        'tournament_id': str(game['tournament'])
                    }
                )
                self.stop_event.set()
            else:
                await self.channel_layer.group_send(
                    self.game_group_name,
                    {
                        'type': 'send_score_state',
                        'game': GameConsumer.game_states[self.game_id]
                    }
                )
                GameConsumer.game_states[self.game_id]['ball']['dx'] = 5
                GameConsumer.game_states[self.game_id]['ball']['dy'] = 5
                await asyncio.sleep(3.2)
        elif ball['x'] + 10 >= GameConsumer.game_states[self.game_id]['canvas_width'] / 2:
            GameConsumer.game_states[self.game_id]['player_one']['score'] += 1
            GameConsumer.game_states[self.game_id] = self.initialize_game_state({
                'player1_score': player1_score + 1,
                'player2_score': player2_score,
                'dx': 5,
                'dy': random.choice([-5, 5])
            })
            if GameConsumer.game_states[self.game_id]['player_one']['score'] >= winner_ball_count:
                game = await self.get_game()
                await self.finish_game(self.player1['nickname'])
                await self.channel_layer.group_send(
                    self.game_group_name,
                    {
                        'type': 'send_finish_state',
                        'game': GameConsumer.game_states[self.game_id],
                        'winner': self.player1,
                        'tournament_id': str(game['tournament'])
                    }
                )
                self.stop_event.set()
            else:
                await self.channel_layer.group_send(
                    self.game_group_name,
                    {
                        'type': 'send_score_state',
                        'game': GameConsumer.game_states[self.game_id]
                    }
                )
                GameConsumer.game_states[self.game_id]['ball']['dx'] = 5
                GameConsumer.game_states[self.game_id]['ball']['dy'] = 5
                await asyncio.sleep(3.2)

    def initialize_game_state(self, data):
        canvas_width = 1368
        canvas_height = 600
        initial_ball_x = 0
        initial_ball_y = 0

        return {
            'canvas_width': canvas_width,
            'canvas_height': canvas_height,
            'player_one': {
                'paddle_y': 0,
                'paddle_x': -canvas_width / 2 + 20,
                'dy': 0,
                'score': data['player1_score']
            },
            'player_two': {
                'paddle_y': 0,
                'paddle_x': canvas_width / 2 - 20,
                'dy': 0,
                'score': data['player2_score']
            },
            'ball': {
                'x': initial_ball_x,
                'y': initial_ball_y,
                'dx': data['dx'],
                'dy': data['dy']
            },
        }

    async def players_count(self):
        return await self.channel_layer.group_count(self.game_group_name)
