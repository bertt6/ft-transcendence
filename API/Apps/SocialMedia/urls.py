
from django.urls import path

from . import views

urlpatterns = [
    path('',views.index, name='socialmedia'),
    path('tweet/<uuid:tweet_id>/',views.tweet, name='tweet'),
]
