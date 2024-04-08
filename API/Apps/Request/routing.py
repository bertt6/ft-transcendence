# chat/routing.py
from django.urls import re_path

from . import consumers
from .consumers import RequestConsumer