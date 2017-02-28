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
            'main_issue_type',
            'amount',
            'resource'
            # 'description',
        ]
        widgets = {
            'point': forms.TextInput,
            # 'issue_types': forms.CheckboxSelectMultiple
        }
        labels = {
            'title': 'Title',
            'main_issue_type': 'Category',
            'amount': 'Amount',
            'resource': ''
        }
        help_texts = {
            'title': _('Add a concise title for your issue, e.g. milk shortage.'),
            'main_issue_type': _('Select under what category your issue falls.'),
            'point': _('Specify a location for your issue by clicking the map and/or dragging the marker.')
        }
