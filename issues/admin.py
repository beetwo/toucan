from django.contrib import admin

from .models import Issue, IssueType

admin.site.register(Issue)
admin.site.register(IssueType)
