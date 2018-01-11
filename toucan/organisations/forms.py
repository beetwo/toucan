from django import forms
from django.utils.translation import ugettext_lazy as _

from .models import Location, Organisation

class ApplyForm(forms.Form):
    # currently just a stub
    pass


class LocationForm(forms.ModelForm):
    class Meta:
        model = Location
        fields = [
            'name',
            # 'city',
            'location'
        ]
        widgets = {
            'location': forms.TextInput
        }
        help_texts = {
            'location': _('Specify a location for your issue by clicking the map and/or dragging the marker.'),
        }


class OrganisationEditForm(forms.ModelForm):
    class Meta:
        model = Organisation
        fields = [
            'name',
            'logo',
            'description',
            'location_description',
            'homepage',
            'email',
            'phone',

        ]