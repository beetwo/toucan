from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from django.utils.crypto import get_random_string


class BaseInvitation(models.Model):

    email = models.EmailField(verbose_name=_('Email'))
    invited_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL)
    invitation_created = models.DateTimeField(auto_now_add=True)
    invitation_valid_until = models.DateTimeField(verbose_name=_('valid until'))

    key = models.CharField(unique=True, max_length=64)

    def generate_key(self):
        return get_random_string(length=64)

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = self.generate_key()
        return super().save(*args, **kwargs)

    class Meta:
        abstract = True


class ToucanInvitation(BaseInvitation):
    pass



