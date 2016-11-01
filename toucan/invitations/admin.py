from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import ugettext_lazy as _
from .models import ToucanInvitation
from django.contrib.auth.models import User

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
        'secret_key',
        'valid_until',
        'validation_link'
    ]

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




