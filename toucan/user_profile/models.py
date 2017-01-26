from django.conf import settings
from django.contrib.gis.db import models as gis_models
from django.db import models
from django.utils.translation import ugettext_lazy as _
from model_utils.choices import Choices
from model_utils.models import TimeStampedModel
from phonenumber_field.modelfields import PhoneNumberField

from ..issues.models import Issue, IssueType
from ..notifications.fields import NotificationTypeField
from ..organisations.models import Organisation


class Subscription(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='subscriptions')
    issue = models.ForeignKey(Issue)

    def __str__(self):
        return 'Subscription object %d' % self.pk

    class Meta:
        ordering = ('-created',)


class NotificationSettings(TimeStampedModel):
    '''
    The base model for any notification filters.

    Notifications can be filtered by the following criteria:
        - the issue type
        - the organisations that issued the issue
        - geographic information => defined by a point and a radius
    '''

    NOTIFICATION_TYPES = Choices(
        ('sms', _('Text Message (SMS)')),
        ('email', _('Email'))
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='notifications_settings')
    notification_type = models.CharField(
        choices=NOTIFICATION_TYPES,
        default='email',
        max_length=20
    )

    issue_types = models.ManyToManyField(IssueType, blank=True, verbose_name=_('issue types'))

    organisations = models.ManyToManyField(
        Organisation,
        blank=True
    )

    point = gis_models.PointField(blank=True)
    point_radius = models.PositiveSmallIntegerField(
        default=2,
        verbose_name=_('radius in kilometers')
    )

    enabled = models.BooleanField(default=True)

    def send(self, issue):
        if self.notification_type == 'email':
            from .notifications.email import EmailNotification as Notification
        elif self.notification_type == 'sms':
            from .notifications.sms import SMSNotification as Notification

        notification = Notification(self, issue)
        return notification.send_issue_notification()

    def __str__(self):
        return 'Notification rule of user: %s' %(self.user.username)

    class Meta:
        ordering = ('-created',)


class Profile(models.Model):

    user = models.OneToOneField(settings.AUTH_USER_MODEL)

    phone_number = PhoneNumberField(
        blank=True,
        verbose_name=_('phone number')
    )

    user_mention_notification = NotificationTypeField(
        blank=True,
        default='',
        verbose_name=_('Notification when mentioned')
    )

    org_mention_notification = NotificationTypeField(
        blank=True,
        default='',
        verbose_name=_('Notification when your organisation is mentioned')
    )
