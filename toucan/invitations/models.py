from django.db import models
from django.conf import settings
from django.core.validators import MinLengthValidator
from django.utils.crypto import get_random_string
from django.utils import timezone
from django.core.urlresolvers import reverse
from django.contrib.postgres.fields import DateTimeRangeField

from organisations.models import Organisation, Membership
from .settings import INVITATION_VALID

class ActiveInvitationManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(
            user__isnull=True,
            invitation_valid_range__contains=timezone.now()
        )


class ToucanInvitation(models.Model):

    email = models.EmailField()
    invited_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='invited')
    invitation_valid_range = DateTimeRangeField(editable=False)

    secret_key = models.CharField(max_length=64, validators=[MinLengthValidator(64)], editable=False, unique=True)

    # this is the user that will be created
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, related_name='invited_through')

    # after the signup the user that was created will get membership in the following organisation
    organisation = models.ForeignKey(Organisation, on_delete=models.SET_NULL, null=True)
    # and this role within the organisation
    role = models.IntegerField(choices=Membership.ROLES_CHOICES, default=0)

    objects = models.Manager()
    active = ActiveInvitationManager()

    def get_verification_link(self, request=None):
        url = reverse('accept_invitation', kwargs={'secret_key': self.secret_key})
        if request:
            url = request.build_absolute_uri(url)
        return url

    def accept(self, user):
        self.user = user
        self.save()

    @property
    def accepted(self):
        return True if self.user else False

    def is_active(self, at=None):
        # if already accepted return immediately
        if self.accepted:
            return False
        # else check time range for validity
        r = self.invitation_valid_range
        if not at:
            at = timezone.now()

        return r.lower <= at <= r.upper

    def has_expired(self):
        return self.invitation_valid_range[1] < timezone.now()

    def save(self, *args, **kwargs):
        if not self.secret_key:
            self.secret_key = get_random_string(64)
        if not self.invitation_valid_range:
            now = timezone.now()
            self.invitation_valid_range = (now, now + INVITATION_VALID)
        return super().save(*args, **kwargs)







