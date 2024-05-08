from django.urls import path, include

urlpatterns = [
    path('', include('Apps.Profile.api.urls')),
    path('auth/', include('Apps.Auth.api.urls')),
    path('tournaments/', include('Apps.Tournament.api.urls')),
    path('', include('Apps.SocialMedia.api.urls')),
    path("chat/", include("Apps.Chat.api.urls")),
    path("request/", include("Apps.Request.api.urls")),
    path('game/', include('Apps.Game.api.urls')),
]