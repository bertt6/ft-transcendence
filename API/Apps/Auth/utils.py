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
    receiver = user.email  # test
    subject = 'LAST DANCE Email Verification'
    message = f'Hi! {user} your one-time verification code is {otp_code['otp']}'
    from_email = 'kaanmesum@gmail.com'
    recipient_list = [receiver]
    send_mail(subject, message, from_email, recipient_list)

    VerificationCode.objects.create(code=otp_code['otp'], expired_date=otp_code['otp'], username=user)

