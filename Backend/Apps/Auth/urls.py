
from django.urls import path , include

from . import views

urlpatterns = [
    path('login/', views.login),
    path('register/', views.register),
    path('verification/', views.verification)
]