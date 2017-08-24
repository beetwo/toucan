from django.conf.urls import url

from .views import IssueCreateView, EditIssueView

app_name = 'issues'

urlpatterns = [
    url(r'^create/$', IssueCreateView.as_view(), name='issue_create'),
    url(r'^(?P<issue_id>\d+)/', EditIssueView.as_view(), name='issue_edit'),
]
