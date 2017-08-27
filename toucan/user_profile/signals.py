from django.conf import settings
from django.db.models.signals import post_save

from toucan.issues.signals import issue_created_signal
from .handlers import issue_created
from .models import Profile


def create_user_profile(**kwargs):
    user = kwargs['instance']
    Profile.objects.get_or_create(user=user)


post_save.connect(create_user_profile, sender=settings.AUTH_USER_MODEL)

issue_created_signal.connect(issue_created)