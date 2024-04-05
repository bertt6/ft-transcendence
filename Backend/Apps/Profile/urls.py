
from django.urls import path

from . import views

urlpatterns = [
    path('',views.index, name='profile'),
    path('<str:profile_username>', views.index, name='profile'),
]