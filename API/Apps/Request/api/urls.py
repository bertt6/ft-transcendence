from django.urls import path

from Apps.Request.api.views import RequestView, ProfileRequestsView

urlpatterns = [
    path('<uuid:request_id>', RequestView.as_view(), name='request'),
    path('', ProfileRequestsView.as_view(), name='profileRequests')
]
