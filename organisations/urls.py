from django.conf.urls import url

from .views import OrganisationList, OrganisationDetail

app_name = 'organisations'
urlpatterns =[
    url(r'^$', OrganisationList.as_view(), name='organisation_list'),
    url(r'^(?P<org_id>\d)/$', OrganisationDetail.as_view(), name='organisation_detail'),
]
