from .models import IssueStatus
from django.db.models.signals import post_save
import django.dispatch


def set_issue_status(**kwargs):
    issue_status = kwargs['instance']
    issue = issue_status.issue
    issue.update_status()


post_save.connect(set_issue_status, sender=IssueStatus)


issue_created_signal = django.dispatch.Signal(providing_args=['instance'])