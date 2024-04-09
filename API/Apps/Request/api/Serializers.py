from rest_framework.serializers import ModelSerializer

from Apps.Request.models import Request


class RequestGetSerializer(ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'