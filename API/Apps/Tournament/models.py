from django.db import models
from ..Profile.models import Profile


class Match(models.Model):
    player1 = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='player1_matches')
    player2 = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='player2_matches')
    winner = models.ForeignKey(Profile, on_delete=models.CASCADE, blank=True, null=True, related_name='won_matches')


class Round(models.Model):
    round_number = models.PositiveIntegerField()
    matches = models.ManyToManyField('Match', blank=True, related_name='rounds')
    participants = models.ManyToManyField(Profile, related_name='round_participants')



class Tournament(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_by = models.ForeignKey(Profile, on_delete=models.CASCADE, default=None)
    max_participants = models.IntegerField()
    current_participants = models.ManyToManyField(Profile, related_name='current_participants')
    is_started = models.BooleanField(default=False)
    rounds = models.ManyToManyField('Round', blank=True, related_name='tournaments')
    #all_games = models.ManyToManyField('Game', blank=True, related_name='all_games')