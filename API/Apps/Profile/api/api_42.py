import os

import requests
from django.contrib.auth.models import User
from rest_framework.response import Response

from Apps.Auth.serializers import RegisterWith42Serializer
from Apps.Auth.utils import send_email
from Apps.Profile.api.Serializers import UserSerializer


def api_42(code):
    response = requests.post(f"{os.getenv("42_API_URL")}/oauth/token", data={
        'grant_type': 'authorization_code',
        'code': code,
        'client_id': os.getenv("42_UID"),
        'client_secret': os.getenv("42_SECRET"),
        'redirect_uri': os.getenv("42_REDIRECT_URL"),
    })
    if response.status_code == 200:
        data_42 = requests.get(
            f"{os.getenv("42_API_URL")}/v2/me",
            headers={'Authorization': f'Bearer {response.json()["access_token"]}'}
        )
        return login_with_42(data_42.json()["login"], data_42.json()["email"], data_42.json()["image"]["link"])
    else:
        return Response({"error": "Access denied"}, status=400)


def login_with_42(username, email, image):
    if not User.objects.filter(username=username).exists():
        serializer = RegisterWith42Serializer(data={"username": username, "email": email})
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        serializer.save()
    user = User.objects.get(username=username)
    if not user.profile.profile_picture:
        user.profile.save_image_from_url(image)
    if user:
        send_email(user)
        return Response(data={'user': UserSerializer(user).data}, status=200)
    else:
        return Response(data={'error': 'User not found'}, status=404)
