from django.urls import path
from .views import create, get_tournaments, join, delete


urlpatterns = [
    path('profile/', create),
    path('profile/<int:tournament_id>', get_tournaments),
    path('profile/join/<int:tournament_id>', join),
    path('profile/delete/<int:tournament_id>', delete)

]