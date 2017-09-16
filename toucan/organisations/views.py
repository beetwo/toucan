from django.views.generic import DetailView, UpdateView, CreateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.core.urlresolvers import reverse
from django.utils.translation import ugettext_lazy as _
from django.utils.functional import cached_property

from django.db.models.functions import Lower
from braces.views import FormValidMessageMixin

from toucan.invitations.permissions import can_invite_to_org
from .models import Location
from .forms import LocationForm

class OrganisationMixin(object):

    @cached_property
    def organisation(self):
        return self.request.user.membership.org


class OrganisationAdminRequiredMixin(PermissionRequiredMixin):

    def has_permission(self):
        return self.request.user.membership.org.is_admin(self.request.user)


class OrganisationDetail(LoginRequiredMixin, OrganisationMixin, DetailView):

    template_name = 'organisations/detail.html'

    def get_object(self, queryset=None):
        return self.organisation

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        user = self.request.user
        ctx.update({
            'is_member': True,
            'can_invite': can_invite_to_org(user, self.object),
            'can_edit_details': self.object.can_edit_details(user),
            'organisation_members': self.object.membership_set
                .select_related('user').order_by('-role', Lower('user__username')),
            'locations': Location.objects.filter(org=self.object),
            'can_edit_locations': self.object.is_admin(user)
        })

        return ctx


class OrganisationEdit(OrganisationAdminRequiredMixin, OrganisationMixin, FormValidMessageMixin, UpdateView):

    template_name = 'organisations/update.html'
    fields = [
        'name',
        'logo',
        'description',
        'location_description',
        'homepage',
        'email',
        'phone',

    ]
    form_valid_message = _('Organisation details updated')

    def get_success_url(self):
        return reverse('organisations:detail')

    def get_object(self, queryset=None):
        return self.organisation


class LocationMixin(OrganisationAdminRequiredMixin, OrganisationMixin):
    model = Location
    form_class = LocationForm

    def get_success_url(self):
        return reverse('organisations:detail')

    def get_queryset(self):
        return Location.objects.filter(org=self.organisation)



class LocationCreate(LocationMixin, FormValidMessageMixin, CreateView):
    template_name = 'organisations/locations/create.html'
    form_valid_message = _('Location created.')

    def form_valid(self, form):
        location = form.instance
        location.org = self.organisation
        return super().form_valid(form)



class LocationEdit(LocationMixin, FormValidMessageMixin, UpdateView):
    template_name = 'organisations/locations/edit.html'
    form_valid_message = _('Location updated.')

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        p = ctx['form'].initial.get('location')
        if p:
            ctx.update({'initial_point': p})
        return ctx



class LocationDelete(LocationMixin, FormValidMessageMixin, DeleteView):
    template_name = 'organisations/locations/delete.html'
    form_valid_message = _('Location deleted.')
