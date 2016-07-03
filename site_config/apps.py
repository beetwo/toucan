from django.apps import AppConfig

class SiteConfigConfig(AppConfig):
    name = 'site_config'

    def ready(self):
        from . import signals

