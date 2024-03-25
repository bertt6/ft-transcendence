from django.db import models
from Apps.Profile.models import Profile


# Create your models here.

class Tweet(models.Model):
    from_user = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True, blank=True)
    content = models.TextField(max_length=250, blank=True, null=True, default=None)
    #image = models.ImageField(upload_to='', blank=True, null=True, default=None)
    date = models.DateTimeField(auto_now_add=True)
    liked_users = models.ManyToManyField(Profile, blank=True, related_name='tweet_liked_users')


class Comment(models.Model):
    from_user = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True, blank=True)
    content = models.TextField(max_length=250, blank=True, null=True, default=None)
    tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE, related_name='comments')
    date = models.DateTimeField(auto_now_add=True)
    liked_users = models.ManyToManyField(Profile, blank=True, related_name='comment_liked_users')
