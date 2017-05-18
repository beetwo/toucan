
import os


def configureWebpackLoader(rootDir, debug=False, bundleDir='production/'):
    return {
        'DEFAULT': {
            'CACHE': not debug,
            'BUNDLE_DIR_NAME': bundleDir,
            'STATS_FILE': os.path.join(rootDir, 'webpack-stats.json'),
            'IGNORE': ['.+\.hot-update.js', '.+\.map']
        }
    }
