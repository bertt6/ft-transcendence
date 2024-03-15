from rest_framework.permissions import BasePermission


class IsEmailVerified(BasePermission):
    def has_permission(self, request, view):
        return request.user.email_verified
