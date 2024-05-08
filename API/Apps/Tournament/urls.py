
from django.urls import path

from . import views

urlpatterns = [
    path('tournaments/', views.index, name='tournament_list'),
    path('create-tournament/', views.create, name='create_tournament'),
    path('tournament/<uuid:tournament_id>/', views.tournament, name='tournament_lobby'),
]
