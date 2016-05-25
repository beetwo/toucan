from django.views.generic import UpdateView, TemplateView, DetailView, CreateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse
from django.contrib.auth import get_user_model
from braces.views import FormValidMessageMixin
from organisations.models import Membership

from .models import Profile, NotificationSettings
from .forms import NotificationSettingsForm


class PublicProfile(DetailView):
    model = get_user_model()
    slug_field = 'username'
    slug_url_kwarg = 'username'
    template_name = 'user_profile/public.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        memberships = Membership.objects\
                            .filter(user=self.request.user)\
                            .order_by('org__name')\
                            .select_related('org')
        ctx.update({
            'memberships': memberships,
        })
        return ctx


class PersonalProfile(LoginRequiredMixin, PublicProfile):

    template_name = 'user_profile/private.html'

    def get_object(self):
        return self.request.user

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        try:
            profile = Profile.objects.get(user=self.object)
        except Profile.DoesNotExist:
            profile = None

        notification_settings = NotificationSettings.objects\
            .filter(user=self.object)\
            .prefetch_related('organisations', 'issue_types')

        ctx.update({
            'profile': profile,
            'notification_settings': notification_settings
        })
        return ctx


class UpdateProfile(LoginRequiredMixin, FormValidMessageMixin, UpdateView):
    fields = [
        'phone_number',
        'user_mention_notification'
    ]

    template_name = 'user_profile/edit_profile.html'
    form_valid_message = _('Profile updated')

    def get_success_url(self):
        return reverse(
            'user_profile:personal_profile',
        )

    def get_object(self, queryset=None):
        return Profile.objects.get_or_create(user=self.request.user)[0]


class NotificationCreate(LoginRequiredMixin, FormValidMessageMixin, CreateView):

    form_class = NotificationSettingsForm
    template_name = 'user_profile/notification/create.html'
    model = NotificationSettings
    form_valid_message = _('Notification settings updated.')

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)

    def get_success_url(self):
        return reverse(
            'user_profile:personal_profile',
        )


class NotificationEdit(PermissionRequiredMixin, UpdateView):
    form_class = NotificationSettingsForm
    template_name = 'user_profile/notification/edit.html'
    model = NotificationSettings
    form_valid_message = _('Notification created.')
    pk_url_kwarg = 'notification_id'


    def has_permission(self):
        return self.request.user == self.get_object().user

    def get_success_url(self):
        return reverse(
            'user_profile:personal_profile',
        )

