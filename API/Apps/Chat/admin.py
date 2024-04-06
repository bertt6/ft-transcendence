from django.contrib import admin

from Apps.Chat.models import Room, Message

# Register your models here.
admin.register(Room)
admin.register(Message)