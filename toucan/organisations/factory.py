import factory
from factory.django import DjangoModelFactory
from django.utils.text import slugify
from random import randint

from .models import Organisation, Location
from toucan.utils.factory import generateRandomPoint

class OrganisationFactory(DjangoModelFactory):

    class Meta:
        model = Organisation

    name = factory.Faker('company')
    short_name = factory.LazyAttribute(lambda x: slugify(x.name))
    description = factory.Faker('paragraph')

    @factory.post_generation
    def locations(self, create, extracted, **kwargs):
        if not create:
            return

        for c in range(randint(1, 15)):
            self.location_set.add(LocationFactory.create(org=self))



class LocationFactory(DjangoModelFactory):
    city = factory.Faker('address')
    location = factory.LazyFunction(generateRandomPoint)

    class Meta:
        model = Location


