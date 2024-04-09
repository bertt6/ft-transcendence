import uuid

from django.db import models

from Apps.Profile.models import Profile


class Request(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='receiver')
    STATUS_CHOICES = (
        ('accepted', 'Accepted'),
        ('pending', 'Pending'),
        ('rejected', 'Rejected'),
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    Types = (
        ('friend', 'Friend'),
        ('game', 'Game'),
        ('tournament', 'Tournament'),
    )
    type = models.CharField(max_length=10, choices=Types)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f'{self.sender} sent a friend request to {self.receiver}'