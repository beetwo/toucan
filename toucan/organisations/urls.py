from django.conf.urls import url, include

from .views import OrganisationDetail, OrganisationEdit, LocationCreate, LocationEdit, LocationDelete

app_name = 'organisations'

urlpatterns = [
    url(r'^$', OrganisationDetail.as_view(), name='detail'),
    url(r'^edit/$', OrganisationEdit.as_view(), name='edit'),
    url(r'^locations/', include([
        url(r'^add/$', LocationCreate.as_view(), name='add'),
        url(r'^(?P<pk>\d+)/$', LocationEdit.as_view(), name='edit'),
        url(r'^(?P<pk>\d+)/delete/$', LocationDelete.as_view(), name='delete')

    ], namespace='locations'))
]
