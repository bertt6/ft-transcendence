from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from ..models import Profile
from rest_framework.response import Response

from .Serializers import ProfileGetSerializer, ProfilePostSerializer, ProfileFriendsSerializer, ProfileStatsSerializer
from ...Request.models import Request


@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
class ProfileView(APIView):
    def get(self, request, profile_nickname):

        if(not profile_nickname):
            return Response({"error": "Profile not found"}, status=404)
        profile = Profile.objects.get(nickname=profile_nickname)
        if not profile:
            return Response({"error": "Profile not found"}, status=404)
        profile_serializer = ProfileGetSerializer(profile)
        return Response(profile_serializer.data, status=200)


class ProfileSearchView(APIView):
    def get(self, request):
        search = request.data.get('search')
        profiles = Profile.objects.filter(nickname__icontains=search)
        if not profiles:
            return Response({"error": "Profile not found"}, status=404)
        profile_serializer = ProfileGetSerializer(profiles, many=True)
        return Response(profile_serializer.data, status=200)
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
        print(request.data.get('profile-picture'))
        profile = request.user.profile
        if not profile:
            return Response({"error": "Profile not found"}, status=404)
        profile_serializer = ProfilePostSerializer(profile, data=request.data)
        if not profile_serializer.is_valid():
            return Response(profile_serializer.errors, status=400)
        profile_serializer.save()
        return Response(profile_serializer.data, status=200)

    def delete(self, request):
        profile = request.user.profileq
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

    def post(self, request,profile_id):
        profile = Profile.objects.get(id=profile_id)
        if not profile:
            return Response({"error": "Profile not found"}, status=404)
        profile.stats = request.data
        profile.save()
        return Response(profile.stats, status=201)

    def put(self, request,profile_id):
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
        history = profile.game_history
        return Response(history, status=200)

    def post(self, request,profile_id):
        profile = Profile.objects.get(id=profile_id)
        if not profile:
            return Response({"error": "Profile not found"}, status=404)
        profile.game_history = request.data
        profile.save()
        return Response(profile.game_history, status=201)

    def put(self, request,profile_id):
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
        if not friend:
            return Response({"error": "Friend not found"}, status=404)
        profile.friends.add(friend)
        profile.save()
        return Response(status=201)


@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
class ProfileBlockedUsersView(APIView):
    def get(self,request):
        profile = request.user.profile
        if not profile:
            return Response({"error": "Profile not found"}, status=404)
        serializer = ProfileFriendsSerializer(profile.blocked_users, many=True)
        return Response(serializer.data, status=200)
    def post(self, request):
        profile_id = request.data.get('user_id')
        profile = request.user.profile

        if Profile.objects.filter(id=profile_id).exists():
            return Response({"error": "Profile not found"}, status=404)

        if profile.blocked_users.filter(id=profile_id).exists():
            profile.blocked_users.add(profile_id)
            if profile.friends.filter(id=profile_id):
                profile.friends.remove(profile_id)
        else:
            profile.blocked_users.remove(profile_id)
        profile.save()
        return Response(status=200)