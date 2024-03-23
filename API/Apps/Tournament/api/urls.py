from django.urls import path
from ..views import create, get_tournaments, join, delete


urlpatterns = [
    path('profile/<int:profile_id>', create),
    path('profile/<int:profile_id>/<int:tournament_id>', get_tournaments),
    path('profile/<int:profile_id>/join/<int:tournament_id>', join),
    path('profile/<int:profile_id>/delete/<int:tournament_id>', delete)

]