from rest_framework.views import APIView

from Apps.Request.api.Serializers import RequestGetSerializer
from Apps.Request.models import Request
from rest_framework.response import Response


class RequestView(APIView):
    def get(self, request, request_id):
        try:
            request = Request.objects.get(id=request_id)
            serializer = RequestGetSerializer(request)
            return Response(serializer.data, status=200)
        except Request.DoesNotExist:
            return Response({"error": "Request not found"}, status=404)

    def put(self,request,request_id):
        try:
            db_request = Request.objects.get(id=request_id)
            db_request.status = request.data.get('status')
            db_request.save()
            return Response({"status": "Request updated"}, status=200)
        except Request.DoesNotExist:
            return Response({"error": "Request not found"}, status=404)
