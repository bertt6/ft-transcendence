import pyotp
from datetime import datetime, timedelta
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.response import Response


def generate_otp():
    totp = pyotp.TOTP(pyotp.random_base32(), interval=60)
    otp = totp.now()
    valid_date = datetime.now() + timedelta(minutes=1)

    return {'otp': otp, 'valid_date': valid_date}


def send_email(user):
    otp_code = generate_otp()
    receiver = user.email  # test
    subject = 'LAST DANCE Email Verification'

    message = f'Hi! {user.username} your one-time verification code is {otp_code['otp']}'

    from_email = 'mailtrap@demomailtrap.com'
    recipient_list = [receiver]
    send_mail(subject, message, from_email, recipient_list)

    response = Response()
    response.data = {'otp': otp_code['otp'], 'valid_date': otp_code['valid_date']}
    response.set_cookie(key='otp', value=str(otp_code['otp']), httponly=True)
    response.set_cookie(key='otp_valid_date', value=str(otp_code['valid_date']), httponly=True)
    response.status_code = status.HTTP_200_OK

    return response
