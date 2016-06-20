from . import *

DEBUG = True

ALLOWED_HOSTS = [
    '127.0.0.1',
    '.brickwall.at',
]

INSTALLED_APPS += [
    'webpack_loader',
]

STATICFILES_DIRS += [
    ('wp', os.path.join(BASE_DIR, 'frontend/production/'))
]

STATIC_ROOT = os.path.join(BASE_DIR, '_static')

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'production/',
        'STATS_FILE': os.path.join(BASE_DIR, 'frontend/webpack-stats-production.json')
    }
}
