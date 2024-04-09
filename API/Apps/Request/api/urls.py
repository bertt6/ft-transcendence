from django.urls import path

from Apps.Request.api.views import RequestView

urlpatterns = [
    path('request/<uuid:request_id>', RequestView.as_view(), name='request')
]
