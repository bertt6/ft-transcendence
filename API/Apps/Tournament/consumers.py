from asgiref.sync import async_to_sync
from django.http import JsonResponse
from channels.generic.websocket import WebsocketConsumer
from django.core.cache import cache

from .cache import add_player_to_cache, remove_player_from_cache, get_players_from_cache, get_player_from_cache
from ..Tournament.Serializers import TournamentPostSerializer, TournamentProfileSerializer
import urllib.parse
from ..Game.models import Game
import json
from ..Profile.models import Profile
from .models import Tournament, Round


class TournamentConsumer(WebsocketConsumer):
    def group_message(self, event):
        data = event["data"]
        send_type = event["send_type"]
        self.send(text_data=json.dumps({
            "data": data,
            "send_type": send_type
        }))

    def send_to_group(self, data, send_type):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "group_message",
                "send_type": send_type,
                "data": data
            }
        )

    def check_params(self):
        if self.tournament_id is None or self.nickname is None:
            return False
        if Profile.objects.filter(nickname=self.nickname).exists():
            return False
        if Tournament.objects.filter(id=self.tournament_id).exists():
            return False
        return True

    def connect(self):
        self.accept()
        query_string = self.scope['query_string'].decode()
        params = urllib.parse.parse_qs(query_string)

        self.tournament_id = params.get('tournament_id', [None])[0]
        self.nickname = params.get('nickname', None)[0]
        self.room_group_name = self.tournament_id
        self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        if self.check_params():
            self.close(code=1000)
        instance = Profile.objects.get(nickname=self.nickname)
        serializer = TournamentProfileSerializer(instance)
        cache_key = f"user_{self.tournament_id}"
        created_by = False
        tournament = Tournament.objects.get(id=self.tournament_id)
        if tournament.created_by == instance:
            created_by = True
        data = add_player_to_cache(serializer.data, cache_key, created_by)
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name,
        )
        tournament.current_participants.add(instance)
        tournament.save()
        tournament_info = {
            "tournament_name": tournament.name,
            "players": data
        }
        self.send_to_group(tournament_info, "tournament_info")

    def receive(self, text_data):
        data = json.loads(text_data)
        if data['send_type'] == 'checkMatch':
            self.checkMatch(self.nickname, self.tournament_id)
        elif data['send_type'] == 'start':
            self.check_start_conditions()
            # self.StartTournament(data)

    def check_start_conditions(self):
        player = get_player_from_cache(f"user_{self.tournament_id}", self.nickname)
        if not player['owner']:
            self.send_error("invalid_profile")
            return
        players = get_players_from_cache(f"user_{self.tournament_id}")
        if len(players) < 3:
            self.send_error("invalid_tournament")
            return
        for player in players:
            if not player['is_ready']:
                self.send_error("players_not_ready")
                return

    def send_error(self, error_type):
        if error_type == "invalid_profile":
            self.send(text_data=json.dumps(
                {"error": 'invalid_profile', "message": "Only the creator can start the tournament"}))
        elif error_type == "invalid_tournament":
            self.send(text_data=json.dumps({"error": "invalid_tournament", "message": "Not enough players"}))
        elif error_type == "tournament_started":
            self.send(text_data=json.dumps({"error": "tournament_started", "message": "Tournament Already Started"}))
        elif error_type == "players_not_ready":
            self.send(text_data=json.dumps({"error": "players_not_ready", "message": "All players must be ready"}))

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name,
        )
        cache_key = f"user_{self.tournament_id}"
        if not remove_player_from_cache(cache_key, self.nickname):
            return
        self.send_to_group(get_players_from_cache(cache_key), "player_list")
        tournament = Tournament.objects.get(id=self.tournament_id)
        profile = Profile.objects.get(nickname=self.nickname)
        tournament.current_participants.remove(profile)
        participants = tournament.current_participants.all()
        if tournament.created_by == profile:
            if participants.exists():
                tournament.created_by = participants.first()
            else:
                tournament.delete()

    def StartTournament(self, data):
        tournament = Tournament.objects.get(id=self.tournament_id)
        participants = tournament.current_participants.all()
        if tournament.rounds.exists():
            self.send_error("tournament_started")
            return
        if tournament.current_participants.count() > 2:
            round_number = 1
            round_obj = Round.objects.create(round_number=round_number)
            round_obj.participants.set(participants)
            tournament.rounds.add(round_obj)
            try:
                round_obj = tournament.rounds.first()
                participants_ids = [participant.id for participant in round_obj.participants.all()]
                all_games = []
                for i in range(0, len(participants_ids), 2):
                    if i + 1 < len(participants_ids):
                        try:
                            profile1 = Profile.objects.get(id=participants_ids[i])
                        except Profile.DoesNotExist:
                            return
                        try:
                            profile2 = Profile.objects.get(id=participants_ids[i + 1])
                        except Profile.DoesNotExist:
                            return
                        game = Game.objects.create(player1=profile1, player2=profile2, tournament_id=self.tournament_id)
                        game_id = str(game.id)
                        player1_nick = str(profile1.nickname)
                        player2_nick = str(profile2.nickname)
                        game_info = {
                            "game_id": game_id,
                            "players": [player1_nick, player2_nick]
                        }
                        all_games.append(game_info)
                        round_obj.matches.add(game)
                        round_obj.participants.remove(participants_ids[i])
                        round_obj.participants.remove(participants_ids[i + 1])
                self.send_to_group(all_games, "game_info")
            except Exception as e:
                print(e)

    def checkMatch(self, profile_id1, tournament_id):
        try:
            profile_id = int(profile_id1)
        except ValueError:
            print("Tournament ID metin olarak beklenen türde değil.")
        try:
            tournament = Tournament.objects.get(pk=tournament_id)
            last_round = tournament.rounds.order_by('-round_number').first()
        except Tournament.DoesNotExist:
            print("Turnuva Yok")
            return
        print(last_round)
        if tournament.is_finished == True:
            print("Turnuva Bitti")
            return
        if last_round:
            all_matches_have_winner = all(Game.winner is not None for match in last_round.matches.all())
            if all_matches_have_winner:
                new_round_number = last_round.round_number + 1
                new_round = Round.objects.create(round_number=new_round_number)

            player_participated = False
            for game in last_round.matches.all():
                if game.player1.id == profile_id or game.player2.id == profile_id:
                    print(game.player1.id, game.player2.id)
                    player_participated = True
                    if game.winner is None:
                        game.winner = game.player2
                        game.save()
                        print("Maçı Player 2 kazandı")
                        return

            if last_round.matches.count() == 1 and not last_round.participants.exists() and last_round.matches.first().winner:
                game = last_round.matches.first()
                tournament.winner = game.winner
                tournament.is_finished = True
                tournament.save()
            if not player_participated:
                print("Player Maclarda Yok")
                return

            winners = [game.winner for game in last_round.matches.all()]
            if len(last_round.participants.all()) == 1:
                winners.append(last_round.participants.first())
            new_round.participants.set(winners)
            tournament.rounds.add(new_round)

            for i in range(0, len(winners), 2):
                if i + 1 < len(winners):
                    game = Game.objects.create(player1=winners[i], player2=winners[i + 1])
                    new_round.matches.add(game)
                    new_round.participants.remove(winners[i])
                    new_round.participants.remove(winners[i + 1])
                new_round.save()
            print("Yeni Turnuva Oluşturuldu")
            return
