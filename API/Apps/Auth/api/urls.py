from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from Apps.Auth.api.views import *

urlpatterns = [
    path('profile', get_profile, name='profile'),
    path('register', register, name='register'),
    path('login', login, name='login'),
    path('send_email_for_verification', send_email_for_verification, name='email_verification'),
    path('email_verification', email_verification, name='email_verification'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]
