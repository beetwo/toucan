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

    #TODO: website, contacts, areas of expertise, logo etc.

    @property
    def active_members(self):
        return self.membership_set.filter(active=True)

    class Meta:
        verbose_name = _('Organisation')
        verbose_name_plural = _('Organisations')

    def __str__(self):
        return self.name


class Membership(TimeStampedModel):

    org = models.ForeignKey(Organisation)
    user = models.ForeignKey(settings.AUTH_USER_MODEL)

    active = models.BooleanField(default=False, blank=True)

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

    def __str__(self):

        base = _('%s@%s' % (str(self.user), str(self.org)))

        if not self.active:
            return _('%s (disabled)' % (base))

        return base


class Location(geo_models.Model):
    city = models.CharField(max_length=255)
    location = LocationField()
    org = models.ForeignKey(Organisation, null=True)

    def __str__(self):
        return self.city
