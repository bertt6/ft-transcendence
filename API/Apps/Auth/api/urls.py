from django.urls import path
from rest_framework_simplejwt.views import TokenBlacklistView
from Apps.Auth.api.views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', register, name='register'),
    path('send-email-for-verification/', send_verification_email, name='email_verification'),
    path('email-verification/', verify_email_and_login, name='email_verification'),
    path('change-password/', change_password, name='change_password'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login-with-42/<str:code>/', login_with_42, name='login_with_42'),
    path('direct-42-login-page/', direct_42_login_page, name='direct_42_login_page'),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),

]
