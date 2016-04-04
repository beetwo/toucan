import factory
from factory.django import DjangoModelFactory
from django.conf import settings
import random
from .models import Issue

from django.contrib.auth import get_user_model

users = list(get_user_model().objects.all())


class IssueFactory(DjangoModelFactory):
    class Meta:
        model = Issue

    title = factory.Faker('sentence')
    description = factory.Faker('paragraph')
    created_by = factory.LazyAttribute(lambda x: random.choice(users))

    priority = 1
    visibility = 3


