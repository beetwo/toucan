from django import forms
from django.utils.translation import ugettext_lazy as _

from phonenumber_field.formfields import PhoneNumberField
from django.contrib.gis.forms.widgets import OSMWidget

from organisations.models import Organisation, Membership
from .models import Profile, NotificationSettings

class UserProfileSignupForm(forms.Form):

    org = forms.ModelChoiceField(
        queryset=Organisation.objects.all(),
        label=_('Primary organisation'),
        help_text=_('You will be able to add more organisations later on.')
    )

    phone = PhoneNumberField(
        label=_('Your mobile phone number')
    )

    def signup(self, request, user):
        profile = Profile.objects.create(
            user=user,
            phone_number=self.cleaned_data['phone']
        )

        Membership.objects.create(
            org=self.cleaned_data['org'],
            user=user,
            active=True
        )


class NotificationSettingsForm(forms.ModelForm):
    class Meta:
        model = NotificationSettings
        fields = [
            'point',
            'point_radius',
            'organisations',
            'issue_types'
        ]
        widgets = {
            'point': OSMWidget
        }



