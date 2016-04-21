from django.views.generic import ListView, DetailView, CreateView, FormView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.urlresolvers import reverse
from django.utils.translation import ugettext_lazy as _
from django.shortcuts import get_object_or_404

from braces.views import FormValidMessageMixin

from .models import Organisation, Membership
from .forms import ApplyForm

class OrganisationList(ListView):
    model = Organisation
    template_name = 'organisations/list.html'


class OrganisationDetail(DetailView):
    model = Organisation
    pk_url_kwarg = 'org_id'
    template_name = 'organisations/detail.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        user = self.request.user
        is_member = self.object.membership_set.filter(user=user).exists() if user.is_authenticated() else False
        ctx.update({
            'is_member': is_member
        })
        return ctx


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

    def get_form_valid_message(self):
        return _('Your application has been sent.')

    def form_valid(self, form):
        org = get_object_or_404(Organisation, pk=self.kwargs['org_id'])
        membership = org.add_member(user=self.request.user)
        self.object = membership
        return super().form_valid(form)

    def get_success_url(self):
        return reverse('organisations:organisation_detail', kwargs={'org_id': self.object.org.pk})
