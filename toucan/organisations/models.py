from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _
from location_field.models.spatial import LocationField
from model_utils.models import TimeStampedModel

from toucan.notifications.fields import NotificationTypeField


def validate_organisation_slug(name):
    User = get_user_model()
    if User.objects.filter(username=name).exists():
        raise ValidationError(
            _('A user with this username already exists. Please choose another name.'),
            code='invalid'
        )


class ActiveOrganisationManager(models.Manager):

    def get_queryset(self):
        return super().get_queryset()\
            .annotate(active_membership_count=models.Count('membership'))\
            .filter(active_membership_count__gte=1)


class Organisation(TimeStampedModel):

    name = models.CharField(max_length=200, verbose_name=_('name'))
    short_name = models.SlugField(
        max_length=50,
        unique=True,
        verbose_name=_('short name'),
        validators=models.SlugField.default_validators + [
            validate_organisation_slug,
        ]
    )

    logo = models.ImageField(blank=True)
    description = models.TextField(blank=True)
    homepage = models.URLField(blank=True)

    objects = models.Manager()
    active = ActiveOrganisationManager()

    @property
    def active_memberships(self):
        return self.membership_set.filter(active=True)

    @property
    def members(self):
        return [m.user for m in self.active_memberships.select_related('user')]


    def add_user_to_org(self, user, role=0, active=True):
        try:
            membership = Membership.objects.get(
                user=user
            )
        except Membership.DoesNotExist:
            membership = Membership.objects.create(
                user=user,
                org=self,
                role=role,
                active=True
            )
        else:
            membership.org = self
            membership.role = role
            membership.active = active
            membership.save()

        return membership

    def add_owner(self, user, **kwargs):
        return self.add_user_to_org(user, role=10, **kwargs)

    def add_administrator(self, user, **kwargs):
        return self.add_user_to_org(user, role=5, **kwargs)

    def add_member(self, user, **kwargs):
        return self.add_user_to_org(user, role=0, **kwargs)

    def can_invite(self, user):
        from toucan.invitations.permissions import can_invite_to_org
        return can_invite_to_org(user, self)

    def can_edit_details(self, user):
        return self.membership_set.filter(user=user, role__gte=5).exists()

    def is_admin(self, user):
        return self.can_edit_details(user)

    class Meta:
        verbose_name = _('Organisation')
        verbose_name_plural = _('Organisations')
        ordering = (
            'name',
        )

    def __str__(self):
        return self.name


class Membership(TimeStampedModel):

    ROLES_CHOICES = [
        (0, _('member')),
        (5, _('admin')),
    ]

    org = models.ForeignKey(Organisation)
    user = models.OneToOneField(settings.AUTH_USER_MODEL)

    active = models.BooleanField(default=False, blank=True)

    role = models.IntegerField(choices=ROLES_CHOICES, default=0)

    # this is currently not used, because there is only one membership and
    # this (global) setting is in the user_profile model
    mention_notification = NotificationTypeField(blank=False, default='email')

    def activate(self):
        if not self.active:
            self.active = True
            self.save()

    def disable(self):
        if self.active:
            self.active = False
            self.save()

    # TODO: roles/permissions should go here too

    class Meta:
        verbose_name = _('organisation membership')
        verbose_name_plural = _('organisation memberships')
        unique_together = (
            ('org', 'user'),
        )

    def __str__(self):

        base = '%s@%s' % (str(self.user), str(self.org))

        if not self.active:
            return '%s (disabled)' % (base)

        return base


class Location(models.Model):
    name = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255, verbose_name='Address')
    location = LocationField()
    org = models.ForeignKey(Organisation, null=True)

    can_assign_issue = models.BooleanField(default=True, verbose_name=_('Issue assignable'))
    display_on_map = models.BooleanField(default=True, verbose_name=_('Display on organisation map'))

    def __str__(self):
        return self.name if self.name else self.city

    def __str__(self):
        return self.city
