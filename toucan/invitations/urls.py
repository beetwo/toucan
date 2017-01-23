from django.conf.urls import url, include
from django.views.generic import TemplateView

from .views import InvitationAcceptedView, InviteToOrgView, RequestInvitationFormView


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
        include([
            url(r'^$',
                RequestInvitationFormView.as_view(),
                name='request_invitation_form'
            ),
            url(
                r'^sent/$',
                TemplateView.as_view(template_name='invitations/request_access/contact_form_sent.html'),
                name='request_invitation_form_sent'
            )
        ])
    )
]