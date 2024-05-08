
from django.urls import path

from Apps.Auth import views
from Apps.Auth.api.views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', views.login),
    path('register/', views.register),
    path('verification/', views.verification)
]