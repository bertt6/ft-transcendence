from django.urls import path

from .views import tournaments, get_tournaments, join, delete, create,websocket_test

urlpatterns = [
    path('', tournaments),
    path('profile/<uuid:profile_id>', create),
    path('<int:profile_id>/<uuid:tournament_id>', get_tournaments),
    path('join/<uuid:tournament_id>', join),
    path('delete/<uuid:tournament_id>', delete),
    path('profile/w/<str:nickname>/', websocket_test)

]

