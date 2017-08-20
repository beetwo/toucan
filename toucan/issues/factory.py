import factory
from factory.django import DjangoModelFactory

import random
from .models import Issue, IssueType
from ..organisations.factory import OrganisationFactory

from django.contrib.auth import get_user_model
from toucan.utils.factory import generateRandomPoint

users = list(get_user_model().objects.all())
types = IssueType.objects.all()



class IssueFactory(DjangoModelFactory):

    class Meta:
        model = Issue

    title = factory.Faker('sentence')
    description = factory.Faker('paragraph')

    # created_by = factory.LazyAttribute(lambda x: random.choice(users))
    created_by = factory.Iterator(get_user_model().objects.all())
    point = factory.LazyFunction(generateRandomPoint)

    organisation = factory.SubFactory(OrganisationFactory)

    @factory.post_generation
    def issue_types(self, create, extracted, **kwargs):
        if not create:
            return

        self.issue_types.add(random.choice(types))

    priority = 1
    visibility = 3
