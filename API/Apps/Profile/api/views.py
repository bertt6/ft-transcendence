from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from ..models import Profile
from rest_framework.response import Response

from .Serializers import ProfileGetSerializer, ProfilePostSerializer, ProfileFriendsSerializer, ProfileStatsSerializer


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
