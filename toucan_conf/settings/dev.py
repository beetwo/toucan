from . import *
from .webpack import configureWebpackLoader

DEBUG = True

ALLOWED_HOSTS = [
    '*'
]

INSTALLED_APPS += [
    'django_extensions',
    'debug_toolbar',
]

MIDDLEWARE_CLASSES = [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
] + MIDDLEWARE_CLASSES

INTERNAL_IPS = [
    '127.0.0.1',
]

WEBPACK_BUILD_DIR = os.path.join(BASE_DIR, 'frontend/build/')

WEBPACK_LOADER = configureWebpackLoader(WEBPACK_BUILD_DIR, debug=DEBUG, bundleDir='build/')

STATICFILES_DIRS = STATICFILES_DIRS[:-1] + [
    ('wp', WEBPACK_BUILD_DIR)
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
