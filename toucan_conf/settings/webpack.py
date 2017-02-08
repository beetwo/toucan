
import os


def configureWebpackLoader(rootDir, debug=False, bundleDir='production/'):
    return {
        'DEFAULT': {
            'CACHE': not debug,
            'BUNDLE_DIR_NAME': bundleDir,
            'STATS_FILE': os.path.join(rootDir, 'webpack-stats.json'),
            'IGNORE': ['.+\.hot-update.js', '.+\.map']
        },
        'BOOTSTRAP': {
            'CACHE': not debug,
            'BUNDLE_DIR_NAME': bundleDir + 'bootstrap/',
            'STATS_FILE': os.path.join(rootDir, 'bootstrap/webpack-stats-bootstrap.json'),
            'IGNORE': ['.+\.hot-update.js', '.+\.map']
        }
    }