from django.db import models
from ..Profile.models import Profile

class Tournament(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created_by = models.ForeignKey(Profile, on_delete=models.CASCADE, default=None)
    max_participants = models.IntegerField()
    current_participants = models.ManyToManyField(Profile, related_name='current_participants')
    is_started = models.BooleanField(default=False)
    rounds = models.ManyToManyField('Round', blank=True, related_name='tournaments')
    #all_games = models.ManyToManyField('Game', blank=True, related_name='all_games')