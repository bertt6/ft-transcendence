from django.shortcuts import render

def index(request):
    return render(request, 'Tournament/tournament.html')


def create(request):
    return render(request, 'Tournament/create-tournament.html')


def tournament(request, tournament_id):
    return render(request, 'Tournament/tournament-lobby.html')
