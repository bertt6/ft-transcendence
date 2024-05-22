# routing.py or asgi.py
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "API.settings")
django_asgi_app = get_asgi_application()

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.urls import re_path
from Apps.Chat.consumers import ChatConsumer
from Apps.Game.consumers import MatchMakingConsumer, GameConsumer
from Apps.Request.consumers import RequestConsumer
from Apps.UserStatus.consumers import OnlineUsersConsumer
from Apps.Tournament.consumers import TournamentConsumer



websocket_urlpatterns = [
    re_path(r'^ws/chat/(?P<room_name>[^/]+)/(?P<nickname>[^/]+)$', ChatConsumer.as_asgi()),
    re_path(r'^ws/status/(?P<nickname>[^/]+)$', OnlineUsersConsumer.as_asgi()),
    re_path(r'^ws/requests/(?P<nickname>[^/]+)$', RequestConsumer.as_asgi()),
    re_path(r'^ws/matchmaking/(?P<nickname>[^/]+)$', MatchMakingConsumer.as_asgi()),
    re_path(r'^ws/game/(?P<game_id>[^/]+)$', GameConsumer.as_asgi()),
    re_path(r'^ws/tournament/$', TournamentConsumer.as_asgi()),
]

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
        ),
    }
)
