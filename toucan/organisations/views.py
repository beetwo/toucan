from django.views.generic import ListView, DetailView, CreateView, FormView, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.core.urlresolvers import reverse
from django.utils.translation import ugettext_lazy as _
from django.shortcuts import get_object_or_404
from django.db.models import Count, ObjectDoesNotExist
from django.db.models.functions import Lower
from braces.views import FormValidMessageMixin

from toucan.invitations.permissions import can_invite_to_org

from .models import Organisation, Membership
from .forms import ApplyForm


class OrganisationList(LoginRequiredMixin, ListView):

    template_name = 'organisations/list.html'

    def get_user_org(self):

        if self.request.user.is_authenticated:
            try:
                return self.request.user.membership.org
            except ObjectDoesNotExist:
                pass
        return None

    def get_queryset(self):
        user_org = self.get_user_org()

        # only select organisations with at least one member and order by
        # lowercased name
        qs = Organisation.objects\
            .annotate(Count('membership')).filter(membership__count__gt=0)\
            .order_by(Lower('name'))

        if user_org:
            qs = qs.exclude(pk=user_org.pk)

        return qs

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        user_org = self.get_user_org()
        if user_org:
            ctx.update({
                'user_organisation': user_org
            })
        return ctx


class OrganisationDetail(LoginRequiredMixin, DetailView):

    model = Organisation
    pk_url_kwarg = 'org_id'
    template_name = 'organisations/detail.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        user = self.request.user
        is_member = self.object.membership_set.filter(user=user).exists() if user.is_authenticated() else False
        ctx.update({
            'is_member': is_member,
            'can_invite': can_invite_to_org(user, self.object),
            'can_edit_details': self.object.can_edit_details(user),
            'organisation_members': self.object.membership_set
                .select_related('user').order_by('-role', Lower('user__username'))
        })

        return ctx


class OrganisationEdit(PermissionRequiredMixin, FormValidMessageMixin, UpdateView):

    model = Organisation
    pk_url_kwarg = 'org_id'
    template_name = 'organisations/update.html'
    fields = [
        'name',
        'logo',
        'description',
        'homepage'
    ]
    form_valid_message = _('Organisation details updated')

    def get_success_url(self):
        return reverse('organisations:organisation_detail', kwargs={'org_id': self.object.pk})

    def has_permission(self, *args, **kwarg):
        org = self.get_object()
        return org.can_edit_details(self.request.user)



class OrganisationCreate(LoginRequiredMixin, CreateView):
    model = Organisation
    template_name = 'organisations/create.html'
    fields = [
        'name',
        'short_name',
        'logo'
    ]

    def form_valid(self, form):
        # this returns a HttpResponseRedirect
        resp = super().form_valid(form)
        # add the user as owner to the organisation
        membership = self.object.add_owner(self.request.user)
        # and return original response
        return resp

    def get_success_url(self):
        return reverse('organisations:organisation_detail', kwargs={'org_id': self.object.pk})



class OrganisationApply(LoginRequiredMixin, FormValidMessageMixin, FormView):

    form_class = ApplyForm
    template_name = 'organisations/apply.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx.update({
            'organisation': get_object_or_404(Organisation, pk=self.kwargs.get('org_id'))
        })
        return ctx

    def get_form_valid_message(self):
        return _('Your application has been sent.')

    def form_valid(self, form):
        org = get_object_or_404(Organisation, pk=self.kwargs['org_id'])
        membership = org.add_member(user=self.request.user)
        self.object = membership
        return super().form_valid(form)

    def get_success_url(self):
        return reverse('organisations:organisation_detail', kwargs={'org_id': self.object.org.pk})
