import os
from .. import *

try:
    from ..secrets import ALLOWED_HOSTS
except ImportError:
    raise ImportError('Please set ALLOWED_HOSTS in the secrets file when using production config.')


try:
    from ..secrets import ANYMAIL
except ImportError:
    raise ImportError('Please set ANYMAIL settings in the secrets file when using production config.')

INSTALLED_APPS += [
    'anymail'
]

DEBUG = False

DEFAULT_FROM_EMAIL = 'toucan@brickwall.at'

WEBPACK_BUILD_DIR = os.path.join(BASE_DIR, 'frontend/production/')

STATICFILES_DIRS = STATICFILES_DIRS[:-1] + [
    ('wp', WEBPACK_BUILD_DIR)
]

STATIC_ROOT = os.path.join(BASE_DIR, '_static')

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'production/',
        'STATS_FILE': os.path.join(
            WEBPACK_BUILD_DIR,
            'webpack-stats-production.json'
        )
    }
}


EMAIL_BACKEND = "anymail.backends.mailgun.MailgunBackend"

# install raven handler if configured
try:
    import raven
    from ..secrets import RAVEN_DSN
except ImportError:
    pass
else:
    RAVEN_CONFIG = {
        'dsn': RAVEN_DSN,
        # If you are using git, you can also automatically configure the
        # release based on the git info.
        'release': raven.fetch_git_sha(BASE_DIR),
    }

