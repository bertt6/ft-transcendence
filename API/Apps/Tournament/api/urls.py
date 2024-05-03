from django.urls import path

from .views import tournaments, get_tournaments, join, delete, create,websocket_test

urlpatterns = [
    path('', tournaments),
    path('profile/<int:profile_id>', create),
    path('<int:profile_id>/<uuid:tournament_id>', get_tournaments),
    path('join/<int:tournament_id>', join),
    path('delete/<int:tournament_id>', delete),
    path('profile/w/<int:profile_id>/', websocket_test)

]

