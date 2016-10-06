from django.conf.urls import url

from .views import InvitationAcceptedView

urlpatterns = [
    url(
        r'verify/(?P<secret_key>\w+)/$',
        InvitationAcceptedView.as_view(),
        name='accept_invitation'
    ),
]