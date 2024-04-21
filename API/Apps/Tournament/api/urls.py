from django.urls import path
from .views import create, get_tournaments,websocket_test

urlpatterns = [
    path('profile/<int:profile_id>', create),
    path('profile/<int:profile_id>/<int:tournament_id>', get_tournaments),
    path('profile/w/<int:profile_id>/', websocket_test)

]

