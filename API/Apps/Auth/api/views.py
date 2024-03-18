from API.serializers import RegisterSerializer, ChangePasswordSerializer
from API.serializers import ProfileSerializer
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import *
from ..utils import *
from rest_framework_simplejwt.tokens import RefreshToken
from .permissions import IsEmailVerified
from ...Profile.models import Profile


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=200)


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
    return response


@api_view(['POST'])
@permission_classes([AllowAny])
def send_email_for_verification(request):
    username = request.data['username']
    password = request.data['password']
    user = User.objects.filter(username=username).first()

    if user is None or not user.check_password(password):
        raise AuthenticationFailed("Wrong Password or Username!")
    response = send_email(user)
    return response


@api_view(['POST'])
@permission_classes([AllowAny])
def email_verification(request):
    verification_code = request.data['verification_code']
    cookie_verification_code = request.COOKIES.get('otp', '')

    user = User.objects.filter(username=request.data['username']).first()
    profile = Profile.objects.filter(user=user).first()

    if verification_code != cookie_verification_code:
        raise AuthenticationFailed("Wrong verification code!")

    profile.is_verified = True
    profile.save()
    return Response({'email': user.email}, status=200)


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

