from django.conf.urls import url, include

from .views import InvitationAcceptedView, InviteToOrgView

urlpatterns = [
    url(
        r'verify/(?P<secret_key>\w+)/$',
        InvitationAcceptedView.as_view(),
        name='accept_invitation'
    ),
    url(
        r'(?P<organisation_id>\d+)/invite/',
        InviteToOrgView.as_view(),
        name='invite_to_org'
    ),
    url(
        r'^request/',
        include('contact_form.urls')
    )
]