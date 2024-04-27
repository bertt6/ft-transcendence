from django.urls import path

from .views import tournaments, get_tournaments, join, delete

urlpatterns = [
    path('', tournaments),
    path('<int:tournament_id>', get_tournaments),
    path('join/<int:tournament_id>', join),
    path('delete/<int:tournament_id>', delete)

