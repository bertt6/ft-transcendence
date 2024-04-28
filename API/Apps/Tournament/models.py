import uuid

from django.db import models
from ..Profile.models import Profile
from ..Game.models import Game


class Round(models.Model):
    round_number = models.PositiveIntegerField()
    matches = models.ManyToManyField(Game, blank=True, related_name='game')
    participants = models.ManyToManyField(Profile, related_name='round_participants')


class Tournament(models.Model):
    id = models.UUIDField(primary_key=True, editable=False,default=uuid.uuid4)
    name = models.CharField(max_length=100, unique=True)
    created_by = models.ForeignKey(Profile, on_delete=models.CASCADE, default=None)
    max_participants = models.IntegerField()
    current_participants = models.ManyToManyField(Profile, related_name='current_participants')
    is_started = models.BooleanField(default=False)
    rounds = models.ManyToManyField('Round', blank=True, related_name='Rounds')
    winner = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True,blank=True, related_name='won_tournaments')
    is_finished = models.BooleanField(default=False)
    #all_games = models.ManyToManyField('Game', blank=True, related_name='all_games')