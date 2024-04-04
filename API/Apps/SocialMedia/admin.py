from django.contrib import admin

from Apps.SocialMedia.models import Tweet, Comment

# Register your models here.

admin.site.register(Tweet)
admin.site.register(Comment)
