# chat/urls.py
from django.urls import path
from .views import start_chat, get_messages

urlpatterns = [
    path('start-chat/', start_chat, name='start-chat'),
    path('get-messages/<uuid:room_id>/', get_messages, name='get-messages'),
]