from django import forms
from django.utils.translation import ugettext_lazy as _

from phonenumber_field.formfields import PhoneNumberField

from organisations.models import Organisation, Membership
from .models import Profile, NotificationSettings

class UserProfileSignupForm(forms.Form):

    phone = PhoneNumberField(
        label=_('Your mobile phone number')
    )

    def signup(self, request, user):
        profile = Profile.objects.create(
            user=user,
            phone_number=self.cleaned_data['phone']
        )



class NotificationSettingsForm(forms.ModelForm):

    class Meta:
        model = NotificationSettings
        fields = [
            'point',
            'point_radius',
            'notification_type',
            'organisations',
            'issue_types',
        ]
        widgets = {
            'point': forms.HiddenInput,
            'notification_type': forms.RadioSelect,
            'organisations': forms.CheckboxSelectMultiple,
            'issue_types': forms.CheckboxSelectMultiple
        }
        help_texts = {
            'organisations': _('Notifications can be filtered by Organisation (default: all)'),
            'issue_types': _('Filter by issue type (default: all)')
        }
