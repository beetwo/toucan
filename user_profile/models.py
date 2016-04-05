from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from phonenumber_field.modelfields import PhoneNumberField


class Profile(models.Model):

    user = models.OneToOneField(settings.AUTH_USER_MODEL)

    phone_number = PhoneNumberField(
        blank=True,
        verbose_name=_('phone number')
    )
