from django import forms
from .models import IssueComment


class CommentForm(forms.ModelForm):
    class Meta:
        model = IssueComment
        fields = ['comment',]
        widgets = {
            'comment': forms.Textarea(attrs={'rows': 3})
        }

