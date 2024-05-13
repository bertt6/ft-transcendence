from datetime import timedelta, datetime
from django.utils import timezone
from rest_framework.response import Response
from .models import VerificationCode
from rest_framework_simplejwt.tokens import RefreshToken


class Authenticator:
    @staticmethod
    def authenticate_user(verification_code):
        try:
            db_verification_code = VerificationCode.objects.get(code=verification_code)
        except VerificationCode.DoesNotExist:
            return None, Response(data={'message': 'Invalid verification code!'}, status=400)

        if verification_code != db_verification_code.code:
            return None, Response(data={'message': 'Incorrect verification code!'}, status=400)

        if (timezone.now() - db_verification_code.expired_date) > timedelta(minutes=15):
            db_verification_code.delete()
            return None, Response(data={'message': 'Verification code expired!'}, status=400)

        db_verification_code.delete()

        return db_verification_code.user.user, None


class TokenGenerator:
    @staticmethod
    def generate_tokens(user):
        tokens = RefreshToken.for_user(user)
        return {
            'tokens': {'access': str(tokens.access_token), 'refresh': str(tokens)},
            'user_id': user.pk,
            'username': user.username
        }
