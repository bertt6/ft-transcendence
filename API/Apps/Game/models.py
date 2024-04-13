from django.db import models

from Apps.Profile.models import Profile
from Apps.Tournament.models import Tournament


# Create your models here.


class Game(models.Model):
    id = models.AutoField(primary_key=True)
    player1 = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='player1')
    player2 = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='player2')
    winner = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='winner', null=True)
    tournament = models.ForeignKey(Tournament, on_delete=models.SET_NULL, blank=True, null=True)
    is_finished = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)