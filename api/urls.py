from django.conf.urls import url
from .views import LocationApi, IssueView

app_name = 'issue_tracker_api'

urlpatterns =[
    url('^$', LocationApi.as_view()),
    url('^issue/(?P<issue_id>\d+)/$', IssueView.as_view(),  name='issue_detail')
]
