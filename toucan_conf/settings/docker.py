from .dev import *

import os

DATABASES['default'] = {
    'HOST': 'db',
    'ENGINE': 'django.db.backends.postgresql',
    'NAME': os.environ['DB_NAME'],
    'PASSWORD': os.environ['DB_PW'],
    'USER': os.environ['DB_USER']
}
