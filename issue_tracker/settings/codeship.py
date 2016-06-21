from .prod import *

DATABASES = {
  'default': {
    'ENGINE': 'django.contrib.gis.db.backends.postgis',
    'NAME': 'issue_tracker',
    'USER': os.environ.get('PG_USER'),
    'PASSWORD': os.environ.get('PG_PASSWORD'),
    'HOST': '127.0.0.1',
    'POST': 5434
  }
}