import factory
from factory.django import DjangoModelFactory
from django.utils.text import slugify

from .models import Organisation


class OrganisationFactory(DjangoModelFactory):

    class Meta:
        model = Organisation

    name = factory.Faker('company')
    short_name = factory.LazyAttribute(lambda x: slugify(x.name))


