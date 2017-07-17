from django.contrib import admin
from .models import Organisation, Membership, Location
from toucan.invitations.models import ToucanInvitation

class LocationInline(admin.StackedInline):
    model = Location
    fields = ['city', 'location']
    can_delete = True
    show_change_link = True


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
        LocationInline,
        InvitationInline,
    ]

    def save_formset(self, request, form, formset, change):
        if formset.model == ToucanInvitation:
            invites = formset.save(commit=False)
            if formset.deleted_objects or formset.changed_objects:
                raise NotImplementedError('Can not deal with inline deletion or changes.')

            for inv in invites:
                inv.invited_by = request.user
                inv.save()
                inv.send(request=request)
        else:
            return super().save_formset(request, form, formset, change)


admin.site.register(Organisation, OrganisationAdmin)


class MembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'org', 'role', 'created', 'modified')
    list_filter = ('role', 'org')


admin.site.register(Membership, MembershipAdmin)

