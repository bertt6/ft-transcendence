import os

from django.http import HttpResponseRedirect
from pytz import timezone

from Apps.Auth.serializers import RegisterSerializer, ChangePasswordSerializer, RegisterWith42Serializer
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import *
from ..utils import *
from rest_framework_simplejwt.tokens import RefreshToken
from .permissions import IsEmailVerified
from ...Profile.api.Serializers import UserSerializer
from ...Profile.api.api_42 import api_42

import logging

from rest_framework.response import Response
from rest_framework.views import APIView

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=201)


@api_view(['POST'])
@permission_classes([IsEmailVerified])
def login(request):
    user = User.objects.filter(username=request.data['username']).first()

    refresh = RefreshToken.for_user(user)
    response = Response()
    response.set_cookie(key='jwt', value=str(refresh.access_token), httponly=True)
    response.data = {
        'tokens': {'access': str(refresh.access_token), 'refresh': str(refresh)},
        'user_id': user.pk,
        'username': user.username
    }
    response.status_code = 200
    logger.info(f"User {user.username} logged in.")
    return response


@api_view(['POST'])
@permission_classes([AllowAny])
def send_email_for_verification(request):
    username = request.data['username']
    password = request.data['password']
    user = User.objects.filter(username=username).first()

    if user is None or not user.check_password(password):
        raise AuthenticationFailed("Wrong Password or Username!")
    send_email(user)
    return Response(data={'message': 'Email sent successfully!'}, status=200)


@api_view(['POST'])
@permission_classes([AllowAny])
def email_verification(request):
    try:
        username = request.data['username']
        verification_code = request.data['verification_code']
        db_verification_code = VerificationCode.objects.get(code=verification_code, username=username)
        user = User.objects.get(username=username)
    except VerificationCode.DoesNotExist:
        return Response(data={'message': 'Invalid verification code!'}, status=400)
    except User.DoesNotExist:
        return Response(data={'message': 'User not found!'}, status=400)
    if verification_code != db_verification_code.code:
        return Response(data={'message': 'Incorrect verification code!'}, status=400)

    expiration_time = timedelta(minutes=15)
    if (datetime.now().astimezone(timezone('UTC')) - db_verification_code.expired_date) > expiration_time:
        return Response(data={'message': 'Verification code expired!'}, status=400)
    db_verification_code.delete()

    profile = user.profile
    profile.is_verified = True
    profile.save()

    tokens = RefreshToken.for_user(user)

    response = Response()
    response.data = {
        'tokens': {'access': str(tokens.access_token), 'refresh': str(tokens)},
        'user_id': user.pk,
        'username': user.username
    }

    response.status_code = 200
    return response


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    password = request.data['old_password']
    new_password = request.data['new_password']
    new_password2 = request.data['new_password2']

    user = User.objects.get(username=request.user)
    if not user.check_password(raw_password=password):
        return Response({'error': 'password not match'}, status=400)
    elif new_password != new_password2:
        return Response({"new_password": "Password fields didn't match."}, status=400)
    else:
        user.set_password(new_password)
        user.save()
        return Response({'success': 'password changed successfully'}, status=200)


@api_view(['POST'])
def direct_42_login_page(request):
    oauth_url = f"https://api.intra.42.fr/oauth/authorize?client_id={os.getenv("42_UID")}&redirect_uri={os.getenv("42_REDIRECT_URL")}&response_type=code"

    return Response({"oauth_url": oauth_url}, status=200)

@api_view(['POST'])
def login_with_42(request, code):
    response = api_42(code)
    return response
