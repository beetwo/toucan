from django import forms
from django.utils.translation import ugettext_lazy as _

from .models import Issue

from django.contrib.gis import forms
from django.contrib.gis.geos import Point

class LatLngForm(forms.Form):
    lat = forms.FloatField()
    lng = forms.FloatField()

    def to_point(self):
        return Point(
            self.cleaned_data['lng'],
            self.cleaned_data['lat']
        )


class IssueForm(forms.ModelForm):

    def clean_issue_types(self):
        types = self.cleaned_data['issue_types']
        if len(types) > 1:
            raise forms.ValidationError(_('Only a single category can be assigned.'))
        return types

    class Meta:
        model = Issue
        fields = [
            'location',
            'point',
            'title',
            'issue_types',
            'description',
            'pick_up_flag'
        ]
        widgets = {
            'location': forms.RadioSelect,
            'point': forms.TextInput,
            # 'issue_types': forms.Select
        }
        labels = {
            'title': _('Title'),
            'issue_types': _('Category'),
            'pick_up_flag': _('I can pick it up myself.')
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
