from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.conf import settings

from django.contrib.gis.db import models as geo_models
from django.contrib.gis.geos import Point

from model_utils.models import TimeStampedModel
from location_field.models.spatial import LocationField


class Organisation(TimeStampedModel):

    name = models.CharField(max_length=200, verbose_name=_('name'))
    short_name = models.CharField(max_length=50, verbose_name=_('short name'), blank=True)
    logo = models.ImageField(blank=True)

    #TODO: website, social accounts, contacts, areas of expertise etc.

    @property
    def active_memberships(self):
        return self.membership_set.filter(active=True)

    def add_user_to_org(self, user, role=0, active=True):
        membership, created = Membership.objects.get_or_create(
            user=user, org=self,
            defaults={'role': role, 'active': active}
        )

        if not created:
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
        (10, _('owner'))
    ]

    org = models.ForeignKey(Organisation)
    user = models.ForeignKey(settings.AUTH_USER_MODEL)

    active = models.BooleanField(default=False, blank=True)

    role = models.IntegerField(choices=ROLES_CHOICES, default=0)

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


class Location(geo_models.Model):
    city = models.CharField(max_length=255)
    location = LocationField()
    org = models.ForeignKey(Organisation, null=True)

    def __str__(self):
        return self.city
