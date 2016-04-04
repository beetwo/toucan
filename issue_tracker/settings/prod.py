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
    ('build', os.path.join(BASE_DIR, 'frontend/production/'))
]


WEBPACK_LOADER = {
    'DEFAULT': {
        'CACHE': not DEBUG,
        'BUNDLE_DIR_NAME': 'build/',
        'STATS_FILE': os.path.join(BASE_DIR, 'frontend/webpack-stats.json'),
        'POLL_INTERVAL': 0.1,
        'IGNORE': ['.+\.hot-update.js', '.+\.map']
    }
}

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'production/',
        'STATS_FILE': os.path.join(BASE_DIR, 'frontend/webpack-stats-prod.json')
    }
}
