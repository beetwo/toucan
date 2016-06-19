from django.conf import settings
from django.db.models.signals import post_save

from issues.models import Issue
from .models import Profile
from .handlers import issue_created


def create_user_profile(**kwargs):
    user = kwargs['instance']
    Profile.objects.get_or_create(user=user)


post_save.connect(create_user_profile, sender=settings.AUTH_USER_MODEL)

post_save.connect(issue_created, sender=Issue)