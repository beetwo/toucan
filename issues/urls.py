from django.conf.urls import url, include

from .views import HomeView, IssueList, IssueDetail, IssueCreateView, CommentCreateView

app_name = 'issues'
urlpatterns = [
    url(r'^$', IssueList.as_view(), name='issue_list'),
    url(r'^create/$',IssueCreateView.as_view(), name='issue_create'),
    url(r'^(?P<issue_id>\d+)/', include([
        url(r'^$', IssueDetail.as_view(), name='issue_detail'),
        url(r'^comment/$', CommentCreateView.as_view(), name='comment_create')
    ])),
]