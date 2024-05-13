from time import timezone
from django.db import models
import uuid


class VerificationCode(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField()
    username = models.CharField()
    expired_date = models.DateTimeField(auto_now_add=True)