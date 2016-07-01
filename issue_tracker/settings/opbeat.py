from .dev import *

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
