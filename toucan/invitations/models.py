from django.db import models
from django.conf import settings
from django.core.validators import MinLengthValidator
from django.utils.crypto import get_random_string
from django.utils import timezone
from django.core.urlresolvers import reverse
from django.contrib.postgres.fields import DateTimeRangeField
from django.template.context import RequestContext
from datetime import timedelta
from django.contrib.sites.models import Site
from organisations.models import Organisation, Membership
from .settings import INVITATION_VALID_DAYS


class ActiveInvitationManager(models.Manager):
    def get_queryset(self):
        now = timezone.now()
        return super().get_queryset().filter(
            user__isnull=True,
            invitation_valid_range__contains=now
        )


class ToucanInvitation(models.Model):

    email = models.EmailField()

    invited_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='invited')
    invitation_valid_range = DateTimeRangeField(editable=False)
    invitation_sent = models.DateTimeField(null=True, blank=True)

    # after the signup the user that was created will get membership in the following organisation
    organisation = models.ForeignKey(Organisation, on_delete=models.SET_NULL, null=True)
    # and this role within the organisation
    role = models.IntegerField(choices=Membership.ROLES_CHOICES, default=0)

    # this holds the secret that will be sent out via mail
    secret_key = models.CharField(max_length=64, validators=[MinLengthValidator(64)], editable=False, unique=True)

    # this is the user that will be created once the invitation is accepted
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, related_name='invited_through')

    # the managers
    objects = models.Manager()
    active = ActiveInvitationManager()

    def get_verification_link(self, request=None):
        location = reverse('accept_invitation', kwargs={'secret_key': self.secret_key})
        if request:
            return request.build_absolute_uri(location)

        # this is where it gets hard ...
        site = Site.objects.get_current(request)
        return 'https://{host}{location}'.format(host=site.domain, location=location)

    def accept(self, user):
        self.user = user
        self.save()

    @property
    def accepted(self):
        return True if self.user else False

    @property
    def sent(self):
        return bool(self.invitation_sent)

    def mark_sent(self):
        if not self.invitation_sent:
            self.invitation_sent = timezone.now()
            self.save()

    def clean(self):
        self.prepare_save()

    def is_active(self, at=None):
        # if already accepted return immediately
        if self.accepted:
            return False

        # else check time range for validity
        if not at:
            at = timezone.now()

        try:
            lower, upper = self.invitation_valid_range[0], self.invitation_valid_range[1]
        except TypeError:
            lower, upper = self.invitation_valid_range.lower, self.invitation_valid_range.upper
        return lower <= at < upper

    def has_expired(self):
        return self.invitation_valid_range[1] < timezone.now()

    def prepare_save(self):
        # set the secret key and the validity range
        if not self.secret_key:
            self.secret_key = get_random_string(64)
        if not self.invitation_valid_range:
            now = timezone.now()
            self.invitation_valid_range = (now, now + timedelta(days=INVITATION_VALID_DAYS))

    def send(self, context={}, request=None):
        from .invites import send_invitation_mail, send_invitation_with_request_context
        if request:
            send_invitation_with_request_context(self, request)
        else:
            send_invitation_mail(self, context)
        self.mark_sent()

    class Meta:
        ordering = [
            '-pk',
        ]

    def __str__(self):
        return 'Invitation to %s for organisation %s' % (self.email, self.organisation.name)


def create_invitation(email, inviter, organisation,
                      role=0, send_invite=False):
    invitation = ToucanInvitation(
        email=email,
        invited_by=inviter,
        organisation=organisation,
        role=role
    )
    invitation.prepare_save()
    invitation.save()

    if send_invite:
        invitation.send()

    return invitation


def create_invitation_from_request(request, email, organisation=None):
    if request.user.is_anonymous:
        raise ValueError('This method need an authenticated user for the request.')

    invitation = create_invitation(
        email,
        request.user,
        organisation or request.user.membership.org,
        send_invite=False
    )
    invitation.send(context=RequestContext(request, {}), request=request)
    return invitation





