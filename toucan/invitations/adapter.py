from allauth.account.adapter import DefaultAccountAdapter

from .settings import INVITATION_SESSION_KEY, INVITATION_REQUIRED


class InvitationAdapter(DefaultAccountAdapter):

    def is_open_for_signup(self, request):
        if hasattr(request, 'session') and request.session.get(INVITATION_SESSION_KEY):
            return True

        return not INVITATION_REQUIRED

