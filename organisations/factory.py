from factory.django import DjangoModelFactory

from .models import Organisation, Location


class OrganisationFactory(DjangoModelFactory):
    class Meta:
        model = Organisation


class LocationFactory(DjangoModelFactory):
    class Meta:
        model = Organisation
