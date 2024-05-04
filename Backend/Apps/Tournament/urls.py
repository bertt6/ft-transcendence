
from django.urls import path

from . import views

urlpatterns = [
    path('tournaments/', views.index, name='tournament_list'),
    path('create-tournament/', views.create, name='tournament_list'),
    path('tournament/<uuid:tournament_id>/', views.tournament, name='tournament'),
]
