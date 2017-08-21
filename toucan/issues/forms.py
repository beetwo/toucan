from django import forms
from django.utils.translation import ugettext_lazy as _

from .models import IssueComment, Issue

from django.contrib.gis import forms


class CommentForm(forms.ModelForm):

    toggle_status = forms.BooleanField(required=False, label=_('toggle'))

    class Meta:
        model = IssueComment
        fields = [
            'comment',
        ]
        widgets = {
            'comment': forms.Textarea(attrs={'rows': 3})
        }


class IssueForm(forms.ModelForm):

    class Meta:
        model = Issue
        fields = [
            'point',
            'title',
            'issue_types',
            'description',
        ]
        widgets = {
            'point': forms.TextInput,
            # 'issue_types': forms.Select
        }
        labels = {
            'title': _('Title'),
            'issue_types': _('Category')
        }
        help_texts = {
            'title': _('Add a concise title for your issue, e.g. milk shortage.'),
            'description': _('''Add a short paragraph about the issue
                where you explain some details, e.g.
                What do you need?
                Is there a specific timeframe?
            '''),
            'issue_types': _('Select under what category your issue falls.'),
            'point': _('Specify a location for your issue by clicking the map and/or dragging the marker.')
        }
