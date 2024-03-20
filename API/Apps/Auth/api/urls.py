from django.urls import path
from Apps.Auth.api.views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register', register, name='register'),
    path('login', login, name='login'),
    path('send_email_for_verification', send_email_for_verification, name='email_verification'),
    path('email_verification', email_verification, name='email_verification'),
    path('change_password', change_password, name='change_password'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]
