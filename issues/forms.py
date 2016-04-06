from django import forms
from .models import IssueComment, Issue


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
            'title',
            'description',
            'location',
            'organisation',
            'priority',
            'visibility'
        ]

        widgets = {
            'visibility': forms.RadioSelect,
            'priority': forms.RadioSelect
        }
