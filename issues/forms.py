from django import forms
from django.utils.translation import ugettext_lazy as _

from .models import IssueComment, Issue

from django.contrib.gis import forms


class CommentForm(forms.ModelForm):
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
            'issue_type',
            'description',
            'organisation',
        ]
        widgets = {
            'point': forms.HiddenInput,
            # 'organisation': forms.RadioSelect
        }
