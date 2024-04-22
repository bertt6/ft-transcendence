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

    if 'tournament' in request.data:
        try:
            tournament = Tournament.objects.get(id=request.data['tournament'])
        except Tournament.DoesNotExist:
            return Response({'message': 'Tournament does not exist!'}, status=400)
    else:
        tournament = None

    game = Game.objects.create(player1=player1, player2=player2, tournament=tournament)
    return Response({'message': 'Game Created!', 'game_id': game.id}, status=201)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def finish_game(request):
    try:
        game = Game.objects.get(id=request.data['game'])
    except Game.DoesNotExist:
        return Response({'message': 'Game does not exist!'}, status=400)

    if 'winner' in request.data:
        winner = request.data['winner']
        if game.player1 != request.user.profile.id and game.player2 != request.user.profile.id:
            return Response({'message': 'Unauthorized access!'}, status=400)
        if game.player1.id == winner or game.player2.id == winner:
            winner_user = Profile.objects.get(id=winner)
            game.winner = winner_user
            game.is_finished = True
            game.save()
        else:
            return Response({'message': 'User not in the this game!'}, status=400)

    return Response({'message': 'Game Finished!'}, status=201)
