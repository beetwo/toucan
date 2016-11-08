from . import *

DEBUG = True

INSTALLED_APPS += [
    'webpack_loader',
    'django_extensions',
    'debug_toolbar',
]

WEBPACK_BUILD_DIR = os.path.join(BASE_DIR, 'frontend/build/')

STATICFILES_DIRS += [
    ('wp', WEBPACK_BUILD_DIR)
]

WEBPACK_LOADER = {
    'DEFAULT': {
        'CACHE': not DEBUG,
        'BUNDLE_DIR_NAME': 'build/',
        'STATS_FILE': os.path.join(WEBPACK_BUILD_DIR, 'webpack-stats-development.json'),
        'POLL_INTERVAL': 0.1,
        'IGNORE': ['.+\.hot-update.js', '.+\.map']
    }
}

MIDDLEWARE_CLASSES = [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
] + MIDDLEWARE_CLASSES

INTERNAL_IPS = [
    '127.0.0.1',
]

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO'
        },
    },
}

ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
