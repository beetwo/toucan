from . import *

DEBUG = False

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

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'production/',
        'STATS_FILE': os.path.join(BASE_DIR, 'frontend/webpack-stats-prod.json')
    }
}
