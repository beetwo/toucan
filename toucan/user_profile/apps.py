from django.apps import AppConfig
from django.db.models.signals import post_save


class UserProfileConfig(AppConfig):
    name = 'toucan.user_profile'
    verbose_name = 'User specific settings'

    def ready(self):

        from . import signals


