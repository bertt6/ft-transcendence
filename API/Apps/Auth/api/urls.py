from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from Apps.Auth.api.views import *

urlpatterns = [
    path('api/profile', get_profile, name='profile'),
    path('api/register', register, name='register'),
    path('api/login', login, name='login'),
    path('api/send_email_for_verification', send_email_for_verification, name='email_verification'),
    path('api/email_verification', email_verification, name='email_verification'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]
