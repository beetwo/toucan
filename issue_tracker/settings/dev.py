from . import *

DEBUG = True

INSTALLED_APPS += [
    'webpack_loader',
    'django_extensions',
    # 'debug_toolbar',
]

STATICFILES_DIRS += [
    ('wp', os.path.join(BASE_DIR, 'frontend/build/'))
]


WEBPACK_LOADER = {
    'DEFAULT': {
        'CACHE': not DEBUG,
        'BUNDLE_DIR_NAME': 'build/',
        'STATS_FILE': os.path.join(BASE_DIR, 'frontend/webpack-stats-development.json'),
        'POLL_INTERVAL': 0.1,
        'IGNORE': ['.+\.hot-update.js', '.+\.map']
    }
}


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
