from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.core.mail import send_mail

import nexmo


def send_sms_notification(phone_number, msg):
    try:
        nexmo_settings = settings.NEXMO
    except AttributeError:
        raise ImproperlyConfigured('Your nexmo settings are not configured correctly.')

    phone_number = phone_number.replace('+', '').replace(' ', '')
    client = nexmo.Client(
        key=nexmo_settings.get('key'),
        secret=nexmo_settings.get('secret')
    )

    return client.send_message({
        'from': 'Toucan',
        'to': phone_number,
        'text': msg
    })


def send_email_notification(email, subject, message):
    return send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [email]
    )

