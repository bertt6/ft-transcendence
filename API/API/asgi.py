# routing.py or asgi.py

import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from django.urls import re_path
from Apps.Chat.consumers import ChatConsumer
from Apps.Game.consumers import MatchMakingConsumer
from Apps.Request.consumers import RequestConsumer
from Apps.UserStatus.consumers import OnlineUsersConsumer

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "API.settings")

django_asgi_app = get_asgi_application()

websocket_urlpatterns = [
    re_path(r'^ws/chat/(?P<room_name>[^/]+)/(?P<nickname>[^/]+)$', ChatConsumer.as_asgi()),
    re_path(r'^ws/online/(?P<user_id>[^/]+)$', OnlineUsersConsumer.as_asgi()),
    re_path(r'^ws/requests/(?P<nickname>[^/]+)$', RequestConsumer.as_asgi()),
    re_path(r'^ws/match-making/(?P<nickname>[^/]+)$', MatchMakingConsumer.as_asgi()),
]

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
        ),
    }
)
