from django.db import models
import uuid

from Apps.Profile.models import Profile


class VerificationCode(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField()
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    expired_date = models.DateTimeField(auto_now_add=True)