from django.views.generic import DetailView
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.contrib import messages
from django.utils.translation import ugettext_lazy as _

from allauth.account.adapter import get_adapter
from allauth.account.views import SignupView
from .models import ToucanInvitation
from .settings import INVITATION_SESSION_KEY


class InvitationAcceptedView(DetailView):
    queryset = ToucanInvitation.active.all()
    slug_field = 'secret_key'
    slug_url_kwarg = 'secret_key'

    def get(self, request, *args, **kwargs):
        invitation = self.get_object()
        # save the invitation key in the session
        request.session[INVITATION_SESSION_KEY] = invitation.secret_key
        # verify the email
        adapter = get_adapter(request)
        adapter.stash_verified_email(request, invitation.email)
        # add a message for the user
        messages.info(
            request,
            _(
                'You have been invited to join %(organisation)s on Toucan. Please continue with the signup process.' % {
                    'organisation': invitation.organisation.name
                }
            )
        )
        # and redirect to
        return HttpResponseRedirect(reverse('account_signup'))


class InvitedSignupView(SignupView):

    def get(self, request, *args, **kwargs):
        self.initial = {
            "invitation_key": request.session.get(INVITATION_SESSION_KEY, '')
        }
        return super().get(request, *args, **kwargs)
