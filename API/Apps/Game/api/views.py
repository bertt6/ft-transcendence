from asgiref.sync import sync_to_async
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from Apps.Game.models import Game
from Apps.Profile.models import Profile
from Apps.Request.models import Request
from Apps.Tournament.models import Tournament


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_game(request):
    try:
        request_id = request.data['request_id']
        request_data = Request.objects.get(id=request_id)
        request_data.status = 'accepted'
        request_data.save()
    except Request.DoesNotExist:
        return Response({'message': 'Request does not exist!'}, status=400)
    try:
        player1 = Profile.objects.get(nickname=request.data['player1'])
        player2 = Profile.objects.get(nickname=request.data['player2'])
    except Profile.DoesNotExist:
        return Response({'message': 'One of the players does not exist!'}, status=400)

    player1.stats.total_games += 1
    player2.stats.total_games += 1
    player1.save()
    player2.save()

    if 'tournament' in request.data:
        try:
            tournament = Tournament.objects.get(id=request.data['tournament'])
        except Tournament.DoesNotExist:
            return Response({'message': 'Tournament does not exist!'}, status=400)
    else:
        tournament = None

    game = Game.objects.create(player1=player1, player2=player2, tournament=tournament)
    return Response({'message': 'Game Created!', 'game_id': game.id}, status=201)


@sync_to_async
def finish_game(game_id, winner_nickname):
    try:
        game = Game.objects.get(id=game_id)
    except Game.DoesNotExist:
        return

    winner = Profile.objects.get(nickname=winner_nickname)
    if game.player1.id == winner.id or game.player2.id == winner.id:
        game.winner = winner
        game.is_finished = True
        game.save()
        if game.player1.nickname != winner_nickname:
            game.player2.win_games(game.player1.mmr)
            game.player1.lose_games(game.player2.mmr)
        else:
            game.player1.win_games(game.player2.mmr)
            game.player2.lose_games(game.player1.mmr)
