from django.urls import path
from Apps.Game.api.views import create_game, finish_game

urlpatterns = [
    path('create-game/', create_game, name='create-game'),
    path('finish-game/', finish_game, name='finish-game'),
]