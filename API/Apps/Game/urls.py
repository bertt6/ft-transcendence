
from django.urls import path

from . import views

urlpatterns = [
    path('game/<uuid:game_id>/', views.index, name='index'),
    path('play/', views.offline_game, name='offline_game'),
]