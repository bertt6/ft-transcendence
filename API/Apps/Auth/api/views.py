from API.serializers import RegisterSerializer
from API.serializers import ProfileSerializer
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import *
from ..utils import *
from rest_framework_simplejwt.tokens import RefreshToken
from .permissions import IsEmailVerified


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    print(request.data)
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST,headers={'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': 'true'})
    send_email(request)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsEmailVerified])
def login(request):
    user = User.objects.filter(username=request.data['username']).first()

    # rest framework token api view
    refresh = RefreshToken.for_user(user)

    response = Response()
    response.set_cookie(key='jwt', value=str(refresh['access_token']), httponly=True)
    response.data = {
        'tokens': {'access': str(refresh['access_token']), 'refresh': str(refresh)},
        'user_id': user.pk,
        'username': user.username
    }
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

    if verification_code != cookie_verification_code:
        raise AuthenticationFailed("Wrong verification code!")

    user.email_verified = True
    return Response(status=status.HTTP_200_OK, data={'email': user.email})


# for test
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    serializer = ProfileSerializer(user, many=False)
    return Response(serializer.data)


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
