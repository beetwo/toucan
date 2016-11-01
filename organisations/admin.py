from django.contrib import admin
from .models import Organisation, Membership


class OrganisationAdmin(admin.ModelAdmin):
    list_display = ('name', 'short_name', 'created', 'modified')


admin.site.register(Organisation, OrganisationAdmin)

class MembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'org', 'role', 'created', 'modified')
    list_filter = ('role',)


admin.site.register(Membership, MembershipAdmin)

