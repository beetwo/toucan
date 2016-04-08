# from django import forms
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
        # geom_type='Point',
        widget=forms.OSMWidget()
    )

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
