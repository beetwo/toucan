from django.core.mail import send_mail
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from django.template.loader import render_to_string
from django.template.context import RequestContext

from .settings import INVITATION_VALID_DAYS


def send_invitation_mail(invitation, ctx={}):
    subject = _('You have been invited to join us on Toucan')

    context = {
        'invitation': invitation,
        'invitation_valid_days': INVITATION_VALID_DAYS,
        'invite_url': invitation.get_verification_link(request=ctx.request if hasattr(ctx, 'request') else None),
        'email': invitation.email,
        'organisation_name': invitation.organisation.name
    }
    context.update(ctx)
    message = render_to_string('invitations/email/invitation.txt', context)
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [invitation.email]
    )

def send_invitation_with_request_context(invitation, request):
    return send_invitation_mail(
        invitation,
        RequestContext(request, {})
    )