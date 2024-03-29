from django.db import models
from django.contrib.auth.models import User


class Stats(models.Model):
    total_games = models.IntegerField()
    total_wins = models.IntegerField()
    total_losses = models.IntegerField()
    points = models.IntegerField()
    # match_history = models.ManyToManyField('Game', blank=True)

    def __str__(self):
        return f"Total Games: {self.total_games}, Total Wins: {self.total_wins}, Total Losses: {self.total_losses}, Points: {self.points}"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,null=True)
    nickname = models.CharField(max_length=100, blank=True, null=True, default=None)
    stats = models.OneToOneField(Stats, on_delete=models.CASCADE, null=True)
    #messages = models.ManyToManyField('Message', blank=True)
    is_online = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    friends = models.ManyToManyField('Profile', blank=True)
    bio = models.TextField(blank=True, null=True, default=None)

    def __str__(self):
        return f"{self.nickname if self.nickname else self.user.username}"
