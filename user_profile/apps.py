from django.apps import AppConfig
from django.dispatch import receiver
from django.db.models.signals import post_save

class UserProfileConfig(AppConfig):
    name = 'user_profile'
    verbose_name = 'User specific settings'

    def ready(self):
        from django.apps import apps as registry
        from .handlers import issue_created
        Issue = registry.get_model('issues', 'Issue')
        post_save.connect(issue_created, sender=Issue)
