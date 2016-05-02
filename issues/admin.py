from django.contrib import admin

from .models import Issue, IssueType, IssueComment, IssueStatus

admin.site.register(Issue)
admin.site.register(IssueType)
admin.site.register(IssueComment)
admin.site.register(IssueStatus)