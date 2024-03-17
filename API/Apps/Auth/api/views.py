from rest_framework.authentication import TokenAuthentication

from API.serializers import RegisterSerializer, ChangePasswordSerializer
from API.serializers import ProfileSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import User
from rest_framework import status
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
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsEmailVerified])
def login(request):
    user = User.objects.filter(username=request.data['username']).first()

    # rest framework token api view
    refresh = RefreshToken.for_user(user)

    response = Response()
    response.set_cookie(key='jwt', value=str(refresh.access_token), httponly=True)
    response.data = {
        'tokens': {'access': str(refresh.access_token), 'refresh': str(refresh)},
        'user_id': user.pk,
        'username': user.username
    }
    response.status_code = status.HTTP_200_OK

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
    return Response({'email': user.email}, status=status.HTTP_200_OK)


# for test
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    serializer = ProfileSerializer(user, many=False)
    return Response(serializer.data, status=status.HTTP_200_OK)


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
        return Response({'error': 'password not match'}, status=status.HTTP_400_BAD_REQUEST)
    elif new_password != new_password2:
        return Response({"new_password": "Password fields didn't match."}, status=status.HTTP_400_BAD_REQUEST)
    else:
        user.set_password(new_password)
        user.save()
        return Response({'success': 'password changed successfully'}, status=status.HTTP_200_OK)



'''
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class LoginView(APIView):
    def post(self, request):
        username = request.data['username']
        password = request.data['password']

        user = User.objects.filter(username=username).first()

        if user is None or not user.check_password(password):
            raise AuthenticationFailed("Wrong Password or Username!")

        token, created = Token.objects.get_or_create(user=user)

        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True)
        response.data = {
            'token': token.key,
            'user_id': user.pk,
            'username': user.username
        }
        return response


class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('token')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithm=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user = User.objects.filter(id=payload['id']).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response
'''
