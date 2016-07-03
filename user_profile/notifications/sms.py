# coding=utf-8

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured

import nexmo
from . import BaseNotification


try:
    nexmo_settings = settings.NEXMO
except AttributeError:
    raise ImproperlyConfigured('Your nexmo settings are not configured correctly.')


class SMSNotification(BaseNotification):

    def get_message(self):
        txt = '%s issue #%d was created:' % (self.issue.issue_type.name if self.issue.issue_type else '', self.issue.pk)
        subject = self.issue.title
        link = self.issue.get_absolute_url()

        if sum(len(txt), len(subject), len(link)) > 137:
            subject_length = 137 - sum(len(txt), len(link))
            subject = subject[:subject_length - 3] + '...'

        final_txt = ' '.join(txt, subject, link)
        return final_txt.strip()

    def send_issue_notification(self):
        phone_number = self.notification.user.profile.phone_number.as_e164.replace('+', '').replace(' ', '')
        client = nexmo.Client(key=nexmo_settings.get('key'), secret=nexmo_settings.get('secret'))

        return client.send_message({
            'from': 'b2it',
            'to': phone_number,
            'text': self.get_message()
        })
