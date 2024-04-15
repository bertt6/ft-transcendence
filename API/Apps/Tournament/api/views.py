from rest_framework.permissions import IsAuthenticated

from ...Profile.models import Profile
from ..models import Tournament
from django.http import HttpResponse
from rest_framework.response import Response
from ..Serializers import TournamentGetSerializer, TournamentPostSerializer
from rest_framework.decorators import api_view, permission_classes

@permission_classes([IsAuthenticated])
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
        serializer = TournamentGetSerializer(tournament)
        return Response(serializer.data)
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
def delete(request, profile_id, tournament_id):
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
        tournament.current_participants.remove(instance)
        tournament.save()
        if tournament.current_participants.count() == 0:
            tournament.delete()
        return Response(status=200)
    else:
        return Response(status=400)
