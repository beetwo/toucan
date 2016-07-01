from .. import *

DEBUG = False

ALLOWED_HOSTS = [
    '127.0.0.1',
    '.brickwall.at',
]

INSTALLED_APPS += [
    'webpack_loader',
]

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

# install opbeat if available
try:
    from .secrets import OPBEAT
except ImportError:
    pass
else:
    INSTALLED_APPS += [
        'opbeat.contrib.django',
    ]

    OPBEAT = {
        'ORGANIZATION_ID': 'af2402d0c17c4c5487c73ddc26691ae1',
        'APP_ID': '665f356411',
        'SECRET_TOKEN': 'f5d22e2d879813223cfc88431e2e762fb32d45b9',
    }

    MIDDLEWARE_CLASSES = [
        'opbeat.contrib.django.middleware.OpbeatAPMMiddleware',
    ] + MIDDLEWARE_CLASSES


# install raven handler if configured
try:
    from .secrets import RAVEN_DSN
    import raven
except ImportError:
    pass
else:
    INSTALLED_APPS += ['raven.contrib.django.raven_compat']
    RAVEN_CONFIG = {
        'dsn': RAVEN_DSN,
        # If you are using git, you can also automatically configure the
        # release based on the git info.
        'release': raven.fetch_git_sha(BASE_DIR),
    }

