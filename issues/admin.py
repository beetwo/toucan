from django.contrib import admin

from .models import Issue, IssueType, IssueComment, IssueStatus

class IssueAdmin(admin.ModelAdmin):
    list_display = ('title', 'issue_type', 'created_by', 'current_status', 'site')
    list_filter = ('site', 'current_status')

admin.site.register(Issue, IssueAdmin)
admin.site.register(IssueType)
admin.site.register(IssueComment)
admin.site.register(IssueStatus)