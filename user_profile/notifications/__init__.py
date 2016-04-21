from ..models import NotificationSettings

from django.core.urlresolvers import reverse
from django.contrib.sites.shortcuts import get_current_site

class BaseNotification(object):

    def __init__(self, notification, issue):

        if not isinstance(notification, NotificationSettings):
            raise ValueError('Notifications need to be instantiated with a %s object as the first argument' % str(NotificationSettings))

        self.notification = notification
        self.user = notification.user
        self.issue = issue

    def get_issue_url(self, request=None):

        if request:
            current_app = self.request.resolver_match.namespace
        else:
            current_app = None

        url = reverse('issues:issue_detail', kwargs={'issue_id': self.issue.pk}, current_app=current_app)

        if request:
            return request.build_absolute_uri(url)
        else:
            return url

    def send_issue_notification(self):
        raise NotImplementedError
