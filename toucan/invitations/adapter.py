from datetime import timedelta

from django.core.urlresolvers import reverse
from allauth.account.adapter import DefaultAccountAdapter

from .settings import INVITATION_SESSION_KEY, INVITATION_REQUIRED


class InvitationAdapter(DefaultAccountAdapter):

    def get_login_redirect_url(self, request):
        user = self.request.user

        # check if this might be the initial login
        login_delta = user.last_login - user.date_joined
        if login_delta < timedelta(seconds=60):
            return reverse('help:first_steps')

        return super().get_login_redirect_url(request)


    def is_open_for_signup(self, request):
        if hasattr(request, 'session') and request.session.get(INVITATION_SESSION_KEY):
            return True

        return not INVITATION_REQUIRED

