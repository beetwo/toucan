from django.views.generic import UpdateView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse

from braces.views import FormValidMessageMixin
from .models import Profile, NotificationSettings
from organisations.models import Membership
from .forms import NotificationSettingsForm

class ViewProfile(LoginRequiredMixin, TemplateView):

    template_name = 'user_profile/base.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        memberships = Membership.objects\
                        .filter(user=self.request.user)\
                        .order_by('org__name')\
                        .select_related('org')

        try:
            profile = Profile.objects.get(user=self.request.user)
        except Profile.DoesNotExist:
            profile = None

        notification_settings = NotificationSettings.objects.filter(user=self.request.user)

        ctx.update({
            'memberships': memberships,
            'profile': profile,
            'notification_settings': notification_settings
        })
        return ctx


class UpdateProfile(LoginRequiredMixin, FormValidMessageMixin, UpdateView):
    fields = [
        'phone_number',
    ]
    template_name = 'user_profile/edit_profile.html'
    form_valid_message = _('Profile updated')

    def get_success_url(self):
        return reverse(
            'user_profile:view_profile',
        )

    def get_object(self, queryset=None):
        return Profile.objects.get_or_create(user=self.request.user)[0]


class NotificationEdit(PermissionRequiredMixin, FormValidMessageMixin, UpdateView):

    pk_url_kwarg = 'notification_id'
    form_class = NotificationSettingsForm
    template_name = 'user_profile/notification_edit.html'
    model = NotificationSettings
    form_valid_message = _('Notification settings updated.')

    def get_success_url(self):
        return reverse(
            'user_profile:view_profile',
        )

    def has_permission(self):
        return self.request.user == self.get_object().user


