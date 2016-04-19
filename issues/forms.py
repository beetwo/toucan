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

    custom_location = forms.PointField(
        label=_('location'),
        widget=forms.TextInput
    )

    class Meta:
        model = Issue
        fields = [
            'point',
            'title',
            'description',
            'organisation',
            # 'priority',
            # 'visibility'
        ]
        widgets = {
            'point': forms.TextInput
        }
