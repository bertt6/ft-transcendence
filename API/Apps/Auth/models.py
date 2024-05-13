from time import timezone
from django.db import models


class VerificationCode(models.Model):
    code = models.CharField()
    username = models.CharField()
    expired_date = models.DateTimeField(auto_now_add=True)