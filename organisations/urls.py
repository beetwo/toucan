from django.conf.urls import url

from .views import OrganisationList, OrganisationDetail, OrganisationCreate

app_name = 'organisations'

urlpatterns =[
    url(r'^$', OrganisationList.as_view(), name='organisation_list'),
    url(r'^(?P<org_id>\d)/$', OrganisationDetail.as_view(), name='organisation_detail'),
    url(r'^create/$', OrganisationCreate.as_view(), name='organisation_create')
]
