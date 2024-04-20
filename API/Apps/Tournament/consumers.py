
from asgiref.sync import async_to_sync
from django.http import JsonResponse
from channels.generic.websocket import WebsocketConsumer
from ..Tournament.Serializers import TournamentPostSerializer
import urllib.parse
import json
from ..Profile.models import Profile
from .models import Tournament, Round, Match


class TournamentConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        query_string = self.scope['query_string'].decode()
        params = urllib.parse.parse_qs(query_string)
        self.profile_id = params.get('profile_id', [None])[0]  # Kullanıcının profile_id'sini sakla
        self.tournament_id = params.get('tournament_id', [None])[0]
        print("Connected to", self.profile_id)
        print("Connected to Tournament", self.tournament_id)

        try:
            instance = Profile.objects.get(id=self.profile_id)
        except Profile.DoesNotExist:
            self.send_error("invalid_profile")
            self.close(code=1000)  # WebSocket bağlantısını kapat
            return

        try:
            tournament = Tournament.objects.get(id=self.tournament_id)
        except Tournament.DoesNotExist:
            self.send_error("invalid_tournament")
            self.close(code=1000)  # WebSocket bağlantısını kapat
            return
        tournament.current_participants.add(instance)
        tournament.save()

    def receive(self, text_data):
        data = json.loads(text_data)
        message = data['tournament_id']
        print(message)
        print("selam")

        self.PlayMatch(self.profile_id, self.tournament_id)
        self.StartTournament(self.profile_id, self.tournament_id)



    def send_error(self, error_type):
        if error_type == "invalid_profile":
            self.send(text_data=json.dumps({"error": "Invalid Profile"}))
        elif error_type == "invalid_tournament":
            self.send(text_data=json.dumps({"error": "Invalid tournament"}))
        elif error_type == "Tournament Already Started":
            self.send(text_data=json.dumps({"error": "Tournament Already Started"}))

    def disconnect(self,close_code):
        try:
            tournament = Tournament.objects.get(id=self.tournament_id)
            participants = tournament.current_participants.filter(id=self.profile_id)

        except Tournament.DoesNotExist:
            self.send_error("invalid_tournament")
            self.close(code=1000)  # WebSocket bağlantısını kapat
            return

        if tournament.current_participants.count() == 0:
            tournament.delete()
        if participants.exists():
            if tournament.created_by_id == self.profile_id and tournament.current_participants.count() > 1:
                first_participant = tournament.current_participants.exclude(id=self.profile_id).first()
                tournament.created_by = first_participant
                tournament.save()
            else:
                tournament.current_participants.remove(self.profile_id)
                tournament.save()
        print(f"Kullanıcı {self.profile_id} bağlantısı kesildi.")

    def StartTournament(self, profile_id,tournament_id):
        print("tournament_id= ", tournament_id)
        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except Tournament.DoesNotExist:
            print("No tournament")


        participants = tournament.current_participants.all()
        if tournament.rounds.exists():
            self.send_error("Tournament Already Started")
            return
        if tournament.current_participants.count() > 2:
            round_number = 1
            round_obj = Round.objects.create(round_number=round_number)
            round_obj.participants.set(participants)
            tournament.rounds.add(round_obj)
            try:
                round_obj = tournament.rounds.first()
                participants = round_obj.participants.all()
                for i in range(0, len(participants), 2):
                    if i + 1 < len(participants):
                        match = Match.objects.create(player1=participants[i], player2=participants[i + 1])
                        round_obj.matches.add(match)
                        round_obj.participants.remove(participants[i])
                        round_obj.participants.remove(participants[i + 1])

            except Exception as e:
                print("Error")
            print("Turnuva Başlatıldı")


    def PlayMatch(self,profile_id1,tournament_id):
        try:
            profile_id = int(profile_id1)  # Metni tamsayıya dönüştür
        except ValueError:
            print("Tournament ID metin olarak beklenen türde değil.")
        print("pd", profile_id)
        try:
            tournament = Tournament.objects.get(pk=tournament_id)
            last_round = tournament.rounds.order_by('-round_number').first()
        except Tournament.DoesNotExist:
            print("Turnuva Yok")
            return
        if tournament.is_finished == True:
            print("Turnuva Bitti")
            return
        print(last_round)
        if last_round:
            all_matches_have_winner = all(match.winner is not None for match in last_round.matches.all())
            if all_matches_have_winner:
                new_round_number = last_round.round_number + 1
                new_round = Round.objects.create(round_number=new_round_number)

            player_participated = False
            for match in last_round.matches.all():
                if match.player1.id == profile_id or match.player2.id == profile_id:
                    print(match.player1.id, match.player2.id)
                    player_participated = True
                    if match.winner is None:
                        match.winner = match.player2
                        match.save()
                        print("Maçı Player 2 kazandı")
                        return


            if last_round.matches.count() == 1 and not last_round.participants.exists() and last_round.matches.first().winner:
                match = last_round.matches.first()
                tournament.winner = match.winner
                tournament.is_finished = True
                tournament.save()
            if not player_participated:
                print("Player Maclarda Yok")
                return

            winners = [match.winner for match in last_round.matches.all()]
            if len(last_round.participants.all()) == 1:
                winners.append(last_round.participants.first())
            new_round.participants.set(winners)
            tournament.rounds.add(new_round)

            for i in range(0, len(winners), 2):
                if i + 1 < len(winners):
                    match = Match.objects.create(player1=winners[i], player2=winners[i + 1])
                    new_round.matches.add(match)
                    new_round.participants.remove(winners[i])
                    new_round.participants.remove(winners[i + 1])
                new_round.save()
            print("Yeni Turnuva Oluşturuldu")
            return