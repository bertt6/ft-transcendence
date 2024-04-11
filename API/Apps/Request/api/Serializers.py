from rest_framework.serializers import ModelSerializer

from Apps.Profile.api.Serializers import ProfileGetSerializer
from Apps.Request.models import Request

class RequestSerializer(ModelSerializer):
    sender = ProfileGetSerializer(read_only=True);
    class Meta:
        model = Request
        fields = '__all__'