from django.views.generic import DetailView, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.core.urlresolvers import reverse
from django.utils.translation import ugettext_lazy as _
from django.utils.functional import cached_property

from django.db.models.functions import Lower
from braces.views import FormValidMessageMixin

from toucan.invitations.permissions import can_invite_to_org


class OrganisationMixin(LoginRequiredMixin):

    @cached_property
    def organisation(self):
        return self.request.user.membership.org

    def get_object(self, queryset=None):
        return self.organisation


class OrganisationDetail(OrganisationMixin, DetailView):


    template_name = 'organisations/detail.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        user = self.request.user

        ctx.update({
            'is_member': True,
            'can_invite': can_invite_to_org(user, self.object),
            'can_edit_details': self.object.can_edit_details(user),
            'organisation_members': self.object.membership_set
                .select_related('user').order_by('-role', Lower('user__username'))
        })

        return ctx


class OrganisationEdit(PermissionRequiredMixin, FormValidMessageMixin, OrganisationMixin, UpdateView):

    template_name = 'organisations/update.html'
    fields = [
        'name',
        'logo',
        'description',
        'homepage'
    ]
    form_valid_message = _('Organisation details updated')

    def get_success_url(self):
        return reverse('organisations:organisation_detail')

    def has_permission(self, *args, **kwarg):
        org = self.get_object()
        return org.can_edit_details(self.request.user)
