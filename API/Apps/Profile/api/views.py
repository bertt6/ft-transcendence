from rest_framework.views import APIView
from ..models import Profile
from rest_framework.response import Response

from .Serializers import ProfileGetSerializer, ProfilePostSerializer


class ProfileView(APIView):
    def get(self, request):
        profile = Profile.objects.all()
        profile_serializer = ProfileGetSerializer(profile, many=True)
        return Response(profile_serializer.data, status=200)

    def post(self, request):
        profile_serializer = ProfilePostSerializer(data=request.data)
        if not profile_serializer.is_valid():
            return Response(profile_serializer.data, status=201)
        profile_serializer.save()
        return Response(profile_serializer.data, status=201)
