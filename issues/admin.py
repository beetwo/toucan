from django.contrib import admin

from .models import Issue, IssueType, IssueComment, IssueStatus


class IssueAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'current_status', )
    list_filter = ('current_status', 'issue_types')

class IssueTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')

admin.site.register(Issue, IssueAdmin)
admin.site.register(IssueType, IssueTypeAdmin)
admin.site.register(IssueComment)
admin.site.register(IssueStatus)
