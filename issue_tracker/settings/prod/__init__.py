from .. import *

try:
    from ..secrets import ALLOWED_HOSTS
except ImportError:
    raise ImportError('Please set ALLOWED_HOSTS in the secrets file when using production config.')


DEBUG = False

DEFAULT_FROM_EMAIL = 'issuetracker@brickwall.at'

WEBPACK_BUILD_DIR = os.path.join(BASE_DIR, 'frontend/production/')

STATICFILES_DIRS += [
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

