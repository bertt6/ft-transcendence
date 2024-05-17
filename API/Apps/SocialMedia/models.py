from django.contrib.auth.models import User
from django.db import models
from Apps.Profile.models import Profile
import uuid


class Tweet(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    from_user = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True, blank=True)
    content = models.TextField(max_length=250, blank=True, null=True, default=None)
    image = models.ImageField(upload_to='', blank=True, null=True, default=None)
    date = models.DateTimeField(auto_now_add=True)
    liked_users = models.ManyToManyField(Profile, blank=True, related_name='tweet_liked_users')

    def __str__(self):
        return self.content


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    from_user = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True, blank=True)
    content = models.TextField(max_length=250, blank=True, null=True, default=None)
    tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE, related_name='comments')
    date = models.DateTimeField(auto_now_add=True)
    liked_users = models.ManyToManyField(Profile, blank=True, related_name='comment_liked_users')

    def __str__(self):
        return self.content