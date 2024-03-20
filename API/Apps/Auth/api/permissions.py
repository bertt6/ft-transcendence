from django.contrib.auth.models import User
from rest_framework.permissions import BasePermission

from Apps.Profile.models import Profile


class IsEmailVerified(BasePermission):
    def has_permission(self, request, view):
        user = User.objects.get(username=request.data['username'])
        return user.profile.is_verified
