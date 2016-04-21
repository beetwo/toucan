from django.conf.urls import url, include

from .views import OrganisationList, OrganisationDetail, OrganisationCreate, OrganisationApply

app_name = 'organisations'

urlpatterns =[
    url(r'^$', OrganisationList.as_view(), name='organisation_list'),
    url(r'^create/$', OrganisationCreate.as_view(), name='organisation_create'),
    url(r'^(?P<org_id>\d)/', include([
        url(r'^$', OrganisationDetail.as_view(), name='organisation_detail'),
        url(r'^apply/$', OrganisationApply.as_view(), name='organisation_apply')
    ]))
]
