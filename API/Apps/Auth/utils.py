import os

import pyotp
from datetime import datetime, timedelta

from django.contrib.auth.models import User
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.response import Response

from Apps.Auth.models import VerificationCode
from Apps.Profile.models import Profile


def token_expired_callback(token):
    print('girdiiii!')
    user_id = token['user_id']
    user = User.objects.get(id=user_id)
    user.profile.is_verified = False
    user.save()


def generate_otp():
    totp = pyotp.TOTP(pyotp.random_base32(), interval=60)
    otp = totp.now()
    expired_date = datetime.now() + timedelta(minutes=1)

    return {'otp': otp, 'otp_expired_date': expired_date}


def send_email(user):
    otp_code = generate_otp()
    receiver = user.email
    subject = 'Transcendence Email Verification'
    message = f'''
    Hello {user.username},

    You can use the following one-time code to verify your Transcendence account:

    Verification Code: {otp_code['otp']}

    This code will help you securely verify your account.

    Regards,
    Transcendence Team
    '''
    from_email = os.getenv("EMAIL_HOST_USER")
    recipient_list = [receiver]
    send_mail(subject, message, from_email, recipient_list)

    VerificationCode.objects.create(code=otp_code['otp'], expired_date=otp_code['otp'], username=user)


