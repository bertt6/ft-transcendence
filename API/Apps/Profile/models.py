from django.db import models
from django.contrib.auth.models import User


class Stats(models.Model):
    total_games = models.IntegerField()
    total_wins = models.IntegerField()
    total_losses = models.IntegerField()
    points = models.IntegerField()
    # match_history = models.ManyToManyField('Game', blank=True)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=100, blank=True, null=True, default=None)
    stats = models.OneToOneField(Stats, on_delete=models.CASCADE)
    # messages = models.ManyToManyField('Message', blank=True)
    is_online = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    friends = models.ManyToManyField('Profile', blank=True)
    bio = models.TextField(blank=True, null=True, default=None)
