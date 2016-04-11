from django.conf.urls import url, include
from .views import LocationApi, IssueView, IssueCommentView

app_name = 'issue_tracker_api'

urlpatterns = [
    url(r'^$', LocationApi.as_view()),
    url(
        r'^issue/(?P<issue_id>\d+)/',
        include([
            url(r'^$', IssueView.as_view(), name='issue_detail'),
            url(r'^comment/$', IssueCommentView.as_view(), name='issue_comments'),
        ])
    ),
]
