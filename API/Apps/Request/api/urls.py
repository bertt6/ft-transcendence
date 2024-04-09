from django.urls import path

from Apps.Request.api.views import RequestView, ProfileRequestsView

urlpatterns = [
    path('request/<uuid:request_id>', RequestView.as_view(), name='request'),
    path('request/', ProfileRequestsView.as_view(), name='profileRequests')
]
