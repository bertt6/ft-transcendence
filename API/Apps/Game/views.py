from django.shortcuts import render


def index(request, game_id):
    return render(request, 'Game/Game.html')


def offline_game(request):
    return render(request, 'Game/OfflineGame.html')
