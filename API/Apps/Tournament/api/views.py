from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from ...Profile.models import Profile
from ..models import Tournament, Round
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.response import Response
from ..Serializers import TournamentGetSerializer, TournamentPostSerializer,RoundSerializer
from rest_framework.decorators import api_view, permission_classes

def websocket_test(request, profile_id):
    return render(request, 'w.html', {'profile_id': profile_id})


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
        rounds = tournament.rounds.all().prefetch_related('matches')
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