import pyotp
from datetime import datetime, timedelta

from django.contrib.auth.models import User
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.response import Response

from Apps.Profile.models import Profile


def token_expired_callback(token):
    user_id = token['user_id']
    user = User.objects.get(id=user_id)
    profile = Profile.objects.get(user=user)
    profile.is_verified = False
    profile.save()


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

    response = Response()
    response.data = {'otp': otp_code['otp'], 'otp_expired_date': otp_code['otp_expired_date']}
    response.set_cookie(key='otp', value=str(otp_code['otp']), httponly=True)
    response.set_cookie(key='otp_expired_date', value=str(otp_code['otp_expired_date']), httponly=True)
    response.status_code = status.HTTP_200_OK

    return response
