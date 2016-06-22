from . import *

DEBUG = True

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

try:

    from .secrets import RAVEN_DSN
    import raven

    INSTALLED_APPS += ['raven.contrib.django.raven_compat']
    RAVEN_CONFIG = {
        'dsn': RAVEN_DSN,
        # If you are using git, you can also automatically configure the
        # release based on the git info.
        'release': raven.fetch_git_sha(BASE_DIR),
    }
except ImportError:
    pass
