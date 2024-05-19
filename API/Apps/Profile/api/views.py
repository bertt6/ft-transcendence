from django.db.models import Q
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from ..models import Profile
from rest_framework.response import Response

from .Serializers import ProfileGetSerializer, ProfilePostSerializer, ProfileFriendsSerializer, ProfileStatsSerializer, \
    ProfileGameSerializer
from ...Game.models import Game
from ...Request.models import Request


@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
class ProfileView(APIView):
    def get(self, request, profile_nickname):
        try:
            if (not profile_nickname):
                return Response({"error": "Profile not found"}, status=404)
            profile = request.user.profile
            blocked_users_ids = profile.blocked_users.values_list('id', flat=True)
            filter = ~Q(id__in=blocked_users_ids) & ~Q(blocked_users=profile)
            profile = Profile.objects.filter(filter).get(nickname=profile_nickname)
            profile_serializer = ProfileGetSerializer(profile)
            return Response(profile_serializer.data, status=200)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=404)


class ProfileSearchView(APIView):
    def get(self, request):
        try:
            profile = request.user.profile
            search = request.data.get('search')
            blocked_users_ids = profile.blocked_users.values_list('id', flat=True)
            filter = Q(nickname__icontains=search) & ~Q(id__in=blocked_users_ids) & ~Q(blocked_users=profile)
            profiles = Profile.objects.filter(filter)
            profile_serializer = ProfileGetSerializer(profiles, many=True)
            return Response(profile_serializer.data, status=200)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=404)


@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
class ProfileDetailView(APIView):
    def get(self, request):
        profile = request.user.profile
        if not profile:
            return Response({"error": "Profile not found"}, status=404)
        profile_serializer = ProfileGetSerializer(profile)
        return Response(profile_serializer.data, status=200)

    def put(self, request):
        profile = request.user.profile
        if not profile:
            return Response({"error": "Profile not found"}, status=404)
        profile_serializer = ProfilePostSerializer(profile, data=request.data)
        if not profile_serializer.is_valid():
            return Response(profile_serializer.errors, status=400)
        profile_serializer.save()
        return Response(profile_serializer.data, status=200)

    def delete(self, request):
        profile = request.user.profile
        if not profile:
            return Response({"error": "Profile not found"}, status=404)
        profile.delete()
        return Response(status=204)


@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
class ProfileStatsView(APIView):
    def get(self, request):
        profile = request.user.profile
        if not profile:
            return Response({"error": "Profile not found"}, status=404)
        stats = profile.stats
        serializer = ProfileStatsSerializer(stats)
        return Response(serializer.data, status=200)

    def post(self, request, profile_id):
        profile = Profile.objects.get(id=profile_id)
        if not profile:
            return Response({"error": "Profile not found"}, status=404)
        profile.stats = request.data
        profile.save()
        return Response(profile.stats, status=201)

    def put(self, request, profile_id):
        profile = Profile.objects.get(id=profile_id)
        if not profile:
            return Response({"error": "Profile not found"}, status=404)
        profile.stats = request.data
        profile.save()
        return Response(profile.stats, status=200)


@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
class ProfileGameHistoryView(APIView):
    def get(self, request):
        profile = request.user.profile
        if not profile:
            return Response({"error": "Profile not found"}, status=404)
        games = Game.objects.filter(Q(player1=profile) | Q(player2=profile)).exclude(winner=None)
        serializer = ProfileGameSerializer(games, many=True)
        return Response(serializer.data, status=200)

    def post(self, request, profile_id):
        profile = Profile.objects.get(id=profile_id)
        if not profile:
            return Response({"error": "Profile not found"}, status=404)
        profile.game_history = request.data
        profile.save()
        return Response(profile.game_history, status=201)

    def put(self, request, profile_id):
        profile = Profile.objects.get(id=profile_id)
        if not profile:
            return Response({"error": "Profile not found"}, status=404)
        profile.game_history = request.data
        profile.save()
        return Response(profile.game_history, status=200)


@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
class ProfileFriendsView(APIView):
    def get(self, request):
        profile = request.user.profile
        if not profile:
            return Response({"error": "Profile not found"}, status=404)
        serializer = ProfileFriendsSerializer(profile.friends, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        request_id = request.data.get('request_id')
        try:
            notification_request = Request.objects.get(id=request_id)
        except Request.DoesNotExist:
            return Response({"error": "Request not found"}, status=404)
        notification_request.status = 'accepted'
        notification_request.save()
        profile = request.user.profile
        if not profile:
            return Response({"error": "Profile not found"}, status=404)
        nickname = request.data.get('nickname')
        friend = Profile.objects.get(nickname=nickname)

        if (not friend or friend.blocked_users.filter(id=request.user.id).exists()
                or profile.blocked_users.filter(id=friend.id).exists()):
            return Response({"error": "Friend not found"}, status=404)
        profile.friends.add(friend)
        profile.save()
        return Response(status=201)


@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
class ProfileBlockedUsersView(APIView):
    def get(self, request):
        profile = request.user.profile
        serializer = ProfileFriendsSerializer(profile.blocked_users, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        from_profile = request.user.profile
        to_profile_id = request.data.get('profile_id')
        to_profile = Profile.objects.get(id=request.data.get('profile_id'))

        if not Profile.objects.filter(id=to_profile_id).exists():
            return Response({"error": "Profile not found"}, status=404)

        if not from_profile.blocked_users.filter(id=to_profile_id).exists():
            from_profile.blocked_users.add(to_profile)
            if from_profile.friends.filter(id=to_profile.id).exists():
                from_profile.friends.remove(to_profile)
                to_profile.friends.remove(from_profile)
            from_profile.save()
            return Response({"error": "Profile blocked"}, status=201)

        else:
            from_profile.blocked_users.remove(to_profile)
            from_profile.save()
            return Response({"error": "Profile block removed"}, status=201)
