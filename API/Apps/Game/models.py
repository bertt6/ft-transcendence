import uuid

from django.db import models
from django.apps import apps
from Apps.Profile.models import Profile
# Create your models here.


class Game(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4)
    player1 = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='player1')
    player2 = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='player2')
    winner = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='winner', null=True, blank=True,default=None)
    is_finished = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)
    tournament = models.ForeignKey('Tournament.Tournament', on_delete=models.CASCADE, null=True, blank=True)

    def str(self):
        return f'{self.player1} vs {self.player2} on {self.date} with Id {self.id}'

    def save(self, *args, **kwargs):
        if self.winner:
            self.is_finished = True
        super().save(*args, **kwargs)