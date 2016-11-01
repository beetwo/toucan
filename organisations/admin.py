from django.contrib import admin
from .models import Organisation, Membership
from toucan.invitations.models import ToucanInvitation


class InvitationInline(admin.TabularInline):
    model = ToucanInvitation
    fields = [
        'email',
        'role'
    ]
    can_delete = False
    show_change_link = True


class OrganisationAdmin(admin.ModelAdmin):
    list_display = ('name', 'short_name', 'created', 'modified')
    inlines = [
        InvitationInline,
    ]

    def save_formset(self, request, form, formset, change):

        if formset.deleted_objects or formset.changed_objects:
            raise NotImplementedError('Can not deal with inline deletion or changes.')

        for inv in formset.new_objects:
            inv.invited_by = request.user
            inv.save()
            inv.send(request=request)


admin.site.register(Organisation, OrganisationAdmin)


class MembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'org', 'role', 'created', 'modified')
    list_filter = ('role',)


admin.site.register(Membership, MembershipAdmin)

