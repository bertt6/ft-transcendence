from django.shortcuts import render

# Create your views here.

def index(request):
    return render(request, 'Tournament/tournament.html')

def create(request):
    return render(request, 'Tournament/create-tournament.html')