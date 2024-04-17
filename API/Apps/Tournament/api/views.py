from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from ...Profile.models import Profile
from ..models import Tournament, Round, Match
from django.http import HttpResponse
from rest_framework.response import Response
from ..Serializers import TournamentGetSerializer, TournamentPostSerializer,RoundSerializer
from rest_framework.decorators import api_view, permission_classes

@api_view(['GET', 'POST'])
def create(request, profile_id):

    try:
        profiles = Profile.objects.get(id=profile_id)
    except Profile.DoesNotExist:
        return Response(status=400)

    if request.method == 'GET':
        Tournaments = Tournament.objects.all()
        serializer = TournamentGetSerializer(Tournaments, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        request.data['created_by'] = profile_id
        request.data['current_participants'] = [profile_id]
        serializert = TournamentPostSerializer(data=request.data)
        if serializert.is_valid():
            serializert.save()
            return Response(serializert.data, status=201)
    return Response(serializert.errors, status=400)



@api_view(['GET', 'PUT', 'DELETE'])
def get_tournaments(request, profile_id, tournament_id):
    try:
        instance = Profile.objects.get(id=profile_id)
    except Profile.DoesNotExist:
        return Response(status=400)

    try:
        tournament = Tournament.objects.get(id=tournament_id)
    except Tournament.DoesNotExist:
        return Response(status=400)

    if request.method == 'GET':
        tournament_serializer = TournamentGetSerializer(tournament)
        rounds = tournament.rounds.all().prefetch_related('matches')  # Tüm maçları tek bir sorgu ile al
        round_serializer = RoundSerializer(rounds, many=True)
        tournament_data = tournament_serializer.data
        tournament_data['rounds'] = round_serializer.data
        return Response(tournament_data)

    elif request.method == 'PUT':
        serializert = TournamentPostSerializer(tournament, data=request.data)
        if serializert.is_valid():
            serializert.save()
            return Response()
    elif request.method == 'DELETE':
        if tournament.created_by.id == profile_id:
            tournament.delete()
            return Response(status=200)
        else:
            return Response(status=400)




@api_view(['GET', 'POST'])
def join(request, profile_id, tournament_id):
    try:
        instance = Profile.objects.get(id=profile_id)
    except Profile.DoesNotExist:
        return Response(data={"error": "invalid user"},status=400)

    try:
        tournament = Tournament.objects.get(id=tournament_id)
    except Tournament.DoesNotExist:
        return Response(data={"error": "invalid tournament"}, status=400)

    participants = tournament.current_participants.filter(id=profile_id)
    if participants.exists():
        return Response(data={"error": "You are already on channel"}, status=400)
    elif tournament.current_participants.count() < tournament.max_participants:
        tournament.current_participants.add(instance)
        tournament.save()
        return Response(status=200)
    else:
        return Response(data={"error": "You have reached the maximum number of participants"})



@api_view(['GET', 'POST'])
def delete(request, tournament_id):
    try:
        tournament = Tournament.objects.get(id=tournament_id)
    except Tournament.DoesNotExist:
        return Response(data={"error": "invalid tournament"}, status=400)

    participants = tournament.current_participants.filter(id=request.user.profile.id)
    if participants.exists():
        tournament.current_participants.remove(request.user.profile.id)
        tournament.save()
        if tournament.current_participants.count() == 0:
            tournament.delete()
        return Response(status=200)
    else:
        return Response(status=400)


@api_view(['GET', 'POST'])
def StartTournament(request, tournament_id):
    try:
        tournament = Tournament.objects.get(id=tournament_id)
    except Tournament.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'POST':
        participants = tournament.current_participants.all()
        if tournament.rounds.exists():
            return Response({"message": "Turnuva zaten başlatıldı."},
                            status=status.HTTP_400_BAD_REQUEST)
        round_number = 1
        round_obj = Round.objects.create(round_number=round_number)
        round_obj.participants.set(participants)
        tournament.rounds.add(round_obj)
        return Response({"message": "Turnuva başarıyla başlatıldı."}, status=status.HTTP_200_OK)

    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET', 'POST'])
def MatchRound(request, tournament_id):
    try:
        tournament = Tournament.objects.get(id=tournament_id)
    except Tournament.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'POST':
        try:
            round_obj = tournament.rounds.first()
            participants = round_obj.participants.all()
            for i in range(0,len(participants),2):
                if i + 1 < len(participants):
                    match = Match.objects.create(player1=participants[i], player2=participants[i + 1])
                    round_obj.matches.add(match)

            return Response({"message": "Maçlar başarıyla oluşturuldu."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)