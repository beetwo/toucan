from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import ugettext_lazy as _
from django.template.context import RequestContext
from django.contrib import messages

from .models import ToucanInvitation, create_invitation


def resend_invitations(modeladmin, request, queryset):
    new_invitations = []
    for invitation in queryset:
        new_invitation = create_invitation(
            invitation.email,
            request.user,
            invitation.organisation,
            role=invitation.role,
            send_invite=False
        )
        new_invitation.send(context=RequestContext(request, {}), request=request)
        new_invitations.append(new_invitation)

    modeladmin.message_user(
        request,
        '%s Invitation(s) re-sent with new expiry dates. %s' % (
            len(new_invitations),
            ', '.join([i.email for i in new_invitations])
        ),
        messages.SUCCESS
    )

resend_invitations.short_description = "Resend invitations."


class ToucanInvitationAdmin(admin.ModelAdmin):
    exclude = [
        'secret_key',
        'user',
        'invitation_sent',
        'invited_by'
    ]
    list_display = [
        'email',
        'user',
        'organisation',
        'valid_until',
        'validation_link'
    ]
    actions = [resend_invitations]

    def valid_until(self, invitation):
        return invitation.invitation_valid_range.upper

    def validation_link(self, invitation):

        if invitation.accepted:
            return True

        if not invitation.is_active():
            return False

        # can be activated
        link = invitation.get_verification_link()
        return format_html(
            '<a href="{}">{}</a>', link, _('Signup with this invitation')
        )

    def save_model(self, request, obj, form, change):

        if not change:
            obj.prepare_save()
            obj.invited_by = request.user

        obj.save()

        if not change:
            # sadly we can not use the request here
            obj.send()


# Register your models here.
admin.site.register(ToucanInvitation, ToucanInvitationAdmin)




