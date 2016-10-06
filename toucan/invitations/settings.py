from datetime import timedelta
from django.conf import settings

INVITATION_VALID = timedelta(getattr(settings, 'INVITATION_VALID_DAYS', 1))
INVITATION_SESSION_KEY = getattr(settings, 'INVITATION_SESSION_KEY', 'invitation_key')
INVITATION_REQUIRED = getattr(settings, 'INVITATION_REQUIRED', True)