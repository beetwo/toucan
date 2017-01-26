from django.db import models
from django.utils.translation import ugettext_lazy as _
from model_utils.choices import Choices


class NotificationTypeField(models.CharField):

    NOTIFICATION_TYPES = Choices(
        ('sms', _('Text Message (SMS)')),
        ('email', _('Email'))
    )

    def __init__(self, *args, **kwargs):
        choices = self.NOTIFICATION_TYPES
        allow_blank = kwargs.get('blank', False)
        if allow_blank:
            choices = [
                          ('', _('No notification'))
            ] + choices

        kwargs.update({
            'choices': choices
        })

        kwargs.setdefault('max_length', 20)
        super().__init__(*args, **kwargs)

