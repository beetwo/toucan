from django.views.generic import ListView, DetailView, CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.urlresolvers import reverse

from .models import Organisation


class OrganisationList(ListView):
    model = Organisation
    template_name = 'organisations/list.html'


class OrganisationDetail(DetailView):
    model = Organisation
    pk_url_kwarg = 'org_id'
    template_name = 'organisations/detail.html'


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
