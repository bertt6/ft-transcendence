
from django.urls import path

from . import views

urlpatterns = [
    path('<uuid:game_id>/',views.index,name='index'),
]