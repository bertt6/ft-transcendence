from django.db import models
from django.contrib.auth.models import User
class Stats(models.Model):
    total_games = models.IntegerField()
    total_wins = models.IntegerField()
    total_losses = models.IntegerField()
    points = models.IntegerField()


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=100)
    stats = models.OneToOneField(Stats, on_delete=models.CASCADE)
    # messages = models.ManyToManyField('Message', blank=True)
    is_online = models.BooleanField(default=False)
    friends = models.ManyToManyField('Profile', blank=True)
    # match_history = models.ManyToManyField('Game', blank=True)