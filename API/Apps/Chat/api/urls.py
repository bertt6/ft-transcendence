# chat/urls.py
from django.urls import path
from .views import start_chat

urlpatterns = [
    path('start_chat', start_chat, name='start_chat'),
]