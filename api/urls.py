from django.conf.urls import url, include
from .views import LocationApi, IssueView, IssueCommentView, UserSearch, IssueStatusView, CommentDetailView

app_name = 'issue_tracker_api'

urlpatterns = [
    url(r'^$', LocationApi.as_view()),
    url(
        r'^issue/(?P<issue_id>\d+)/',
        include([
            url(r'^$', IssueView.as_view(), name='issue_detail'),
            url(r'^comment/$', IssueCommentView.as_view(), name='issue_comments'),
            url(r'^status/$', IssueStatusView.as_view(), name='issue_status'),
        ])
    ),
    url(r'^users/$', UserSearch.as_view(), name='user_search'),
    url(r'^comment/(?P<pk>\d+)/$', CommentDetailView.as_view(), name='comment_detail')

]
