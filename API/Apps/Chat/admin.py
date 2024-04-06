from django.contrib import admin

from Apps.Chat.models import Room, Message

admin.site.register(Room)
admin.site.register(Message)