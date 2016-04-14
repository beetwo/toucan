from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel
from phonenumber_field.modelfields import PhoneNumberField

from issues.models import Issue



class Profile(models.Model):

    user = models.OneToOneField(settings.AUTH_USER_MODEL)

    phone_number = PhoneNumberField(
        blank=True,
        verbose_name=_('phone number')
    )


class Subscription(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='subscriptions')
    issue = models.ForeignKey(Issue)

    def __str__(self):
        return 'Subscription object %d' % self.pk
