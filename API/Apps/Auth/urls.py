
from django.urls import path
from Apps.Auth.api.views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('api/register', register, name='register'),
    path('api/login', login, name='login'),
    path('api/send_email_for_verification', send_email_for_verification, name='email_verification'),
    path('api/email_verification', email_verification, name='email_verification'),
    path('api/change_password', change_password, name='change_password'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]