from django.contrib import admin

from .models import Issue, IssueType, IssueComment, IssueStatus


class IssueAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'current_status', )
    list_filter = ('current_status', 'issue_types')

class IssueTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'description_short')
    fields = ['name', 'slug', 'description']

    def description_short(self, issueType):
        desc = issueType.description
        if desc:
            return desc[:57] + '...' if len(desc) > 60 else desc
        return '-'

    description_short.short_description = 'Description'


admin.site.register(Issue, IssueAdmin)
admin.site.register(IssueType, IssueTypeAdmin)
admin.site.register(IssueComment)
admin.site.register(IssueStatus)
