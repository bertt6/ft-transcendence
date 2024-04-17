import uuid
from django.db import models
from Apps.Profile.models import Profile


class Room(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    first_user = models.ForeignKey(Profile, related_name='room_first', on_delete=models.CASCADE)
    second_user = models.ForeignKey(Profile, related_name='room_second', on_delete=models.CASCADE)


class Message(models.Model):
    user = models.ForeignKey(Profile, related_name='messages', on_delete=models.CASCADE)
    room = models.ForeignKey(Room, related_name='messages', on_delete=models.CASCADE)
    content = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.nickname} - {self.content}"
