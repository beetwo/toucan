import os
from . import *

ALLOWED_HOSTS = [
    'toucan.sos-kd.org'
]

DEBUG = False

DEFAULT_FROM_EMAIL = 'toucan@sos-kd.org'


STATIC_ROOT = os.path.join(BASE_DIR, '_static')

# install raven handler if configured
try:
    import raven
    dsn = os.environ.get('RAVEN_DSN')
except (ImportError, KeyError):
    pass
else:
    RAVEN_CONFIG = {
        'dsn': dsn,
        # If you are using git, you can also automatically configure the
        # release based on the git info.
        'release': raven.fetch_git_sha(BASE_DIR),
    }

