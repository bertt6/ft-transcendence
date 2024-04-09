from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from Apps.Request.api.Serializers import RequestSerializer
from Apps.Request.models import Request
from rest_framework.response import Response


class RequestView(APIView):
    def get(self, request, request_id):
        try:
            request = Request.objects.get(id=request_id)
            serializer = RequestSerializer(request)
            return Response(serializer.data, status=200)
        except Request.DoesNotExist:
            return Response({"error": "Request not found"}, status=404)

    def put(self, request, request_id):
        try:
            db_request = Request.objects.get(id=request_id)
            db_request.status = request.data.get('status')
            db_request.save()
            return Response({"status": "Request updated"}, status=200)
        except Request.DoesNotExist:
            return Response({"error": "Request not found"}, status=404)

    def post(self, request):
        serializer = RequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        serializer.save()
        return Response(serializer.data, status=201)


@permission_classes([IsAuthenticated])
class ProfileRequestsView(APIView):
    def get(self, request):
        requests = Request.objects.filter(receiver=request.user.profile)
        serializer = RequestSerializer(requests, many=True)
        return Response(serializer.data, status=200)