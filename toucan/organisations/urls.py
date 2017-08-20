from django.conf.urls import url, include

from .views import OrganisationDetail, OrganisationEdit

app_name = 'organisations'

urlpatterns = [
    url(r'^$', OrganisationDetail.as_view(), name='organisation_detail'),
    url(r'^edit/$', OrganisationEdit.as_view(), name='organisation_edit'),
]
